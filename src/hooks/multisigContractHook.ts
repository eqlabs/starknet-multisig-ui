import { useStarknet } from "@starknet-react/core";
import throttle from "lodash/throttle";
import { useEffect, useMemo, useState } from "react";
import {
  Abi,
  Contract,
  encode,
  getChecksumAddress,
  number,
  validateAndParseAddress,
} from "starknet";
import {
  addMultisigTransaction,
  findMultisig,
  updateMultisigInfo,
} from "~/state/utils";
import { pendingStatuses, TransactionStatus } from "~/types";
import { compareStatuses, getMultisigTransactionInfo } from "~/utils";
import Source from "../../public/Multisig.json";
import { useTransaction, useTransactionStatus } from "./transactionStatus";

export const useMultisigContract = (
  address: string,
  polling?: false | number
): {
  contract: Contract | undefined;
  status: TransactionStatus;
  loading: boolean;
} => {
  const pollingInterval = polling || 20000;

  const { library: provider } = useStarknet();

  const [status, send] = useTransactionStatus();
  const [loading, setLoading] = useState<boolean>(false);

  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [contract, setContract] = useState<Contract | undefined>();

  const validatedAddress = useMemo(
    () => validateAndParseAddress(getChecksumAddress(address)),
    [address]
  );

  // Fetch and set the multisig contract to state
  useEffect(() => {
    if (validatedAddress) {
      try {
        const multisigContract = new Contract(
          Source.abi as Abi,
          validatedAddress,
          provider
        );
        setContract(multisigContract);
      } catch (_e) {
        console.error(_e);
      }
    }
  }, [provider, validatedAddress]);

  // Search for multisig in local cache
  const cachedMultisig = findMultisig(validatedAddress);

  const { transaction } = useTransaction(
    cachedMultisig?.transactionHash,
    pollingInterval
  );

  // Poll for transactionCount
  useEffect(() => {
    let heartbeat: NodeJS.Timer | false;
    // Store the previous polling result to avoid redundant updates
    let previous = 0;

    const getTransactionCount = async () => {
      try {
        // Poll only if the contract itself is deployed
        if (
          status.value &&
          !pendingStatuses.includes(status.value as TransactionStatus)
        ) {
          const { res } = (await contract?.get_transactions_len()) || {
            transactions_len: number.toBN(0),
          };

          // Only update the state if there has been a change
          if (res && res.toNumber() !== previous) {
            setTransactionCount(res.toNumber());
            previous = res.toNumber();
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    getTransactionCount();
    heartbeat = !!polling && setInterval(getTransactionCount, pollingInterval);

    return () => {
      heartbeat && clearInterval(heartbeat);
    };
  }, [contract, polling, pollingInterval, status.value]);

  // Contract deployment status nudger
  useEffect(() => {
    const getContractStatus = async () => {
      // If match found, use more advanced state transitions
      if (!transaction?.status) {
        try {
          // If match not found, just see if contract is deployed
          const { res: transactionCount } =
            await contract?.get_transactions_len();
          transactionCount && send("DEPLOYED");
        } catch (_e) {
          console.error(_e);
        }
      }

      // Nudge the state machine forward or reject
      if (
        transaction?.status &&
        compareStatuses(transaction.status, status.value as TransactionStatus) >
          0
      ) {
        send("ADVANCE");
      } else if (transaction?.status === TransactionStatus.REJECTED) {
        send("REJECT");
      }
    };

    contract && getContractStatus();
  }, [contract, send, status.value, transaction?.status]);

  const fetchInfo = useMemo(
    () =>
      contract &&
      status.value &&
      !pendingStatuses.includes(status.value as TransactionStatus)
        ? throttle(async () => {
            !cachedMultisig && setLoading(true);
            try {
              const { signers: signersResponse } =
                (await contract?.get_signers()) || {
                  signers: [],
                };
              const signers = signersResponse
                .map(number.toHex)
                .map(encode.sanitizeHex)
                .map(getChecksumAddress)
                .map(validateAndParseAddress);
              const { threshold } = (await contract?.get_threshold()) || {
                threshold: number.toBN(0),
              };

              if (cachedMultisig) {
                updateMultisigInfo({
                  ...cachedMultisig,
                  signers: signers,
                  threshold: threshold.toNumber(),
                });
              } else {
                updateMultisigInfo({
                  address: validatedAddress,
                  signers: signers,
                  threshold: threshold.toNumber(),
                  transactions: [],
                });
              }
            } catch (e) {
              console.error(e);
            }
            setLoading(false);
          }, 5000)
        : () => {},
    [cachedMultisig, contract, status.value, validatedAddress]
  );

  // Fetcher for transactionCount
  useEffect(() => {
    contract !== undefined && fetchInfo();
    return () => {
      setTransactionCount(0);
    };
  }, [contract, fetchInfo]);

  const fetchTransactions = useMemo(
    () =>
      validatedAddress && contract && transactionCount > 0
        ? throttle(
            async () => {
              try {
                let currentTransactionIndex = transactionCount - 1;

                while (currentTransactionIndex >= 0) {
                  if (
                    !cachedMultisig?.transactions.find(
                      (tx) =>
                        tx.nonce === currentTransactionIndex && tx.executed
                    )
                  ) {
                    const parsedTransaction = await getMultisigTransactionInfo(
                      contract,
                      currentTransactionIndex
                    );
                    addMultisigTransaction(validatedAddress, parsedTransaction);
                  }
                  currentTransactionIndex -= 1;
                }
              } catch (error) {
                console.error(error);
              }
            },
            5000,
            { trailing: true }
          )
        : () => {},
    [validatedAddress, cachedMultisig?.transactions, contract, transactionCount]
  );

  // Fetch transaction info if transactionCount has changed
  useEffect(() => {
    // Fetch transactions of this multisig if the contract is deployed
    status.value &&
      !pendingStatuses.includes(status.value as TransactionStatus) &&
      fetchTransactions();
  }, [fetchTransactions, status.value]);

  return {
    contract,
    status: status.value as TransactionStatus,
    loading,
  };
};
