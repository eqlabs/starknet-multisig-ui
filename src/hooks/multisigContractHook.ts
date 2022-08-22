import { useStarknet } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Abi, Contract, validateAndParseAddress } from "starknet";
import { sanitizeHex } from "starknet/dist/utils/encode";
import { toBN, toHex } from "starknet/dist/utils/number";
import { useSnapshot } from "valtio";
import { MultisigInfo, state } from "~/state";
import { addMultisigTransaction } from "~/state/utils";
import {
  MultisigTransaction,
  pendingStatuses,
  TransactionStatus,
} from "~/types";
import { compareStatuses, mapTargetHashToText } from "~/utils";
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
  const pollingInterval = polling || 2000;

  const { multisigs } = useSnapshot(state);

  const { library: provider } = useStarknet();

  const [status, send] = useTransactionStatus();
  const [loading, setLoading] = useState<boolean>(true);

  const [signers, setSigners] = useState<string[]>([]);
  const [threshold, setThreshold] = useState<number>(0);
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [contract, setContract] = useState<Contract | undefined>();

  const validatedAddress = validateAndParseAddress(address);

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

  // Search for multisig in local cache with transactionHash included
  const cachedMultisig = multisigs.find(
    (multisig: MultisigInfo) =>
      multisig.address === validatedAddress && multisig.transactionHash
  );

  const { transaction } = useTransaction(
    cachedMultisig?.transactionHash,
    pollingInterval
  );

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

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true);
      try {
        // If contract is deployed, fetch more info
        if (
          status.value &&
          !pendingStatuses.includes(status.value as TransactionStatus)
        ) {
          const { signers: signersResponse } =
            (await contract?.get_signers()) || {
              signers: [],
            };
          const signers = signersResponse.map(toHex).map(sanitizeHex);
          const { threshold } = (await contract?.get_threshold()) || {
            threshold: toBN(0),
          };
          const { res: transactionCount } =
            (await contract?.get_transactions_len()) || {
              transactions_len: toBN(0),
            };

          setSigners(signers.map(validateAndParseAddress));
          setThreshold(threshold.toNumber());
          transactionCount && setTransactionCount(transactionCount.toNumber());
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    contract !== undefined && fetchInfo();

    return () => {
      setSigners([]);
      setThreshold(0);
      setTransactionCount(0);
    };
  }, [contract, multisigs, provider, send, status.value]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        if (contract && transactionCount > 0) {
          let currentTransactionIndex = transactionCount - 1;

          while (currentTransactionIndex >= 0) {
            const { tx: transaction, tx_calldata: calldata } =
              await contract.get_transaction(currentTransactionIndex);

            const parsedTransaction: MultisigTransaction = {
              nonce: currentTransactionIndex,
              to: toHex(transaction.to),
              function_selector: mapTargetHashToText(
                transaction.function_selector.toString()
              ),
              calldata: calldata.toString().split(","),
              calldata_len: transaction.calldata_len.toNumber(),
              executed: transaction.executed.toNumber() === 1,
              threshold: transaction.threshold.toNumber(),
            };

            addMultisigTransaction(address, parsedTransaction);
            currentTransactionIndex -= 1;
          }
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    // Fetch transactions of this multisig if the contract is deployed
    status.value &&
      !pendingStatuses.includes(status.value as TransactionStatus) &&
      fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, transactionCount]);

  return {
    contract,
    status: status.value as TransactionStatus,
    loading,
    signers,
    threshold,
    transactionCount,
  };
};
