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
import { useSnapshot } from "valtio";
import { state } from "~/state";
import { addMultisigTransaction, updateMultisigInfo } from "~/state/utils";
import { TransactionStatus, pendingStatuses } from "~/types";
import { getMultisigTransactionInfo } from "~/utils";
import Source from "../../public/Multisig.json";
import { useTransaction } from "./transactionStatus";

export const useMultisigContract = (
  address: string,
  polling?: false | number
): {
  contract: Contract | undefined;
  status: TransactionStatus;
  loading: boolean;
} => {
  const pollingInterval = polling || 20000;

  const [loading, setLoading] = useState<boolean>(false);
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [contract, setContract] = useState<Contract | undefined>();

  const { wallet } = useSnapshot(state);

  const validatedAddress = useMemo(
    () => validateAndParseAddress(getChecksumAddress(address)),
    [address]
  );

  // Search for multisig in state / cache
  const cachedMultisig = state.multisigs.find(
    (multisig) => multisig.address === validatedAddress
  );

  const { transaction } = useTransaction(
    cachedMultisig?.transactionHash,
    pollingInterval
  );

  // Fetch and set the multisig contract to state
  useEffect(() => {
    if (validatedAddress) {
      try {
        const multisigContract = new Contract(
          Source.abi as Abi,
          validatedAddress,
          wallet?.provider
        );
        setContract(multisigContract);
      } catch (_e) {
        console.error(_e);
      }
    }
  }, [validatedAddress, wallet?.provider]);

  // Poll for transactionCount
  useEffect(() => {
    let heartbeat: NodeJS.Timer | false;
    // Store the previous polling result to avoid redundant updates
    let previous = 0;

    const getTransactionCount = async () => {
      try {
        const { res } = (await contract?.get_transactions_len()) || {
          transactions_len: number.toBN(0),
        };

        // Only update the state if there has been a change
        if (res && res.toNumber() !== previous) {
          setTransactionCount(res.toNumber());
          previous = res.toNumber();
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
  }, [contract, polling, pollingInterval, transaction?.status]);

  const fetchInfo = useMemo(
    () =>
      contract &&
      transaction?.status &&
      !pendingStatuses.includes(transaction?.status as TransactionStatus)
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
    [cachedMultisig, contract, transaction?.status, validatedAddress]
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
    transaction?.status &&
      !pendingStatuses.includes(transaction?.status as TransactionStatus) &&
      fetchTransactions();
  }, [fetchTransactions, transaction?.status]);

  return {
    contract,
    status: transaction?.status as TransactionStatus,
    loading,
  };
};
