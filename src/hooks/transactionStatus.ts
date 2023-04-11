import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { state } from "~/state";
import { updateTransactionStatus } from "~/state/utils";
import { TransactionInfo, TransactionStatus } from "~/types";
import { compareStatuses } from "~/utils";

export const useTransaction = (
  transactionHash?: string,
  polling?: number
): { transaction: TransactionInfo | null; loading: boolean } => {
  const pollingInterval = polling || 2000;

  const [loading, setLoading] = useState<boolean>(true);

  const { transactions, wallet } = useSnapshot(state);

  useEffect(() => {
    let heartbeat: NodeJS.Timer | false;

    const getLatestStatus = async () => {
      if (transactionHash && transactionHash !== "") {
        let tx_status;

        const response = await wallet?.provider.getTransactionReceipt(
          transactionHash
        );
        tx_status = response?.status as TransactionStatus;
        if (compareStatuses(tx_status, TransactionStatus.ACCEPTED_ON_L1) >= 0) {
          heartbeat && clearInterval(heartbeat);
        }

        tx_status !== undefined &&
          updateTransactionStatus(transactionHash, tx_status);
      }
    };

    getLatestStatus();
    setLoading(false);

    heartbeat = !!polling && setInterval(getLatestStatus, pollingInterval);

    return () => {
      heartbeat && clearInterval(heartbeat);
    };
  }, [transactionHash, polling, pollingInterval, wallet?.provider]);

  return {
    transaction: transactions.find((tx) => tx.hash === transactionHash) || null,
    loading,
  };
};
