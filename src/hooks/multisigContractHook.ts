import { useStarknet } from "@starknet-react/core";
import throttle from "lodash/throttle";
import { useEffect, useMemo, useState } from "react";
import { Abi, Contract, validateAndParseAddress } from "starknet";
import { sanitizeHex } from "starknet/dist/utils/encode";
import { toBN, toHex } from "starknet/dist/utils/number";
import { addMultisigTransaction, findMultisig } from "~/state/utils";
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
  signers: string[];
  threshold: number;
  transactionCount: number;
} => {
  const pollingInterval = polling || 20000;

  const { library: provider } = useStarknet();

  const [status, send] = useTransactionStatus();
  const [loading, setLoading] = useState<boolean>(true);

  const [signers, setSigners] = useState<string[]>([]);
  const [threshold, setThreshold] = useState<number>(0);
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [contract, setContract] = useState<Contract | undefined>();

  const validatedAddress = useMemo(
    () => validateAndParseAddress(address),
    [address]
  );

  // Fetch and set the multisig contract to state
  useEffect(() => {
    if (address) {
      try {
        const validatedAddress = validateAndParseAddress(address);
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
  }, [address, provider]);

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
          signers.length > 0 &&
          !pendingStatuses.includes(status.value as TransactionStatus)
        ) {
          const { res } = (await contract?.get_transactions_len()) || {
            transactions_len: toBN(0),
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
  }, [contract, polling, pollingInterval, signers.length, status.value]);

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
            setLoading(true);
            try {
              const { signers: signersResponse } =
                (await contract?.get_signers()) || {
                  signers: [],
                };
              const signers = signersResponse.map(toHex).map(sanitizeHex);
              const { threshold } = (await contract?.get_threshold()) || {
                threshold: toBN(0),
              };

              setSigners(signers.map(validateAndParseAddress));
              setThreshold(threshold.toNumber());
            } catch (e) {
              console.error(e);
            }
            setLoading(false);
          }, 5000)
        : () => {},
    [contract, status.value]
  );

  // Basic info fetcher
  // TODO: Could be deprecated in favor of SSR / incremental static generation
  useEffect(() => {
    contract !== undefined && fetchInfo();
    return () => {
      setSigners([]);
      setThreshold(0);
      setTransactionCount(0);
    };
  }, [contract, fetchInfo]);

  const fetchTransactions = useMemo(
    () =>
      address && contract && transactionCount > 0
        ? throttle(
            async () => {
              try {
                let currentTransactionIndex = transactionCount - 1;

                while (currentTransactionIndex >= 0) {
                  const parsedTransaction = await getMultisigTransactionInfo(
                    contract,
                    currentTransactionIndex
                  );
                  addMultisigTransaction(address, parsedTransaction);
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
    [address, contract, transactionCount]
  );

  // Fetch transaction info if transactionCount has changed
  useEffect(() => {
    // Fetch transactions of this multisig if the contract is deployed
    status.value &&
      !pendingStatuses.includes(status.value as TransactionStatus) &&
      fetchTransactions();
  }, [address, contract, fetchTransactions, status.value, transactionCount]);

  return {
    contract,
    status: status.value as TransactionStatus,
    loading,
    signers,
    threshold,
    transactionCount,
  };
};
