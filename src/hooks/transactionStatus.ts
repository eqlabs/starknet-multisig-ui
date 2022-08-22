import { useStarknet } from "@starknet-react/core";
import { useMachine } from "@xstate/react";
import { useEffect, useState } from "react";
import { createMachine } from "xstate";
import { findTransaction, updateTransactionStatus } from "~/state/utils";
import { TransactionInfo, TransactionStatus } from "~/types";
import { compareStatuses } from "~/utils";

const transactionStateMachine = createMachine({
  id: "transactionStatus",
  schema: {
    context: {} as { value: TransactionStatus },
    events: {} as
      | { type: "ADVANCE" }
      | { type: "REJECT" }
      | { type: "DEPLOYED" },
  },
  initial: TransactionStatus.NOT_RECEIVED,
  states: {
    [TransactionStatus.NOT_RECEIVED]: {
      on: {
        ADVANCE: TransactionStatus.RECEIVED,
        REJECT: TransactionStatus.REJECTED,
        DEPLOYED: TransactionStatus.ACCEPTED_ON_L2,
      },
    },
    [TransactionStatus.RECEIVED]: {
      on: {
        ADVANCE: TransactionStatus.PENDING,
        REJECT: TransactionStatus.REJECTED,
      },
    },
    [TransactionStatus.PENDING]: {
      on: {
        ADVANCE: TransactionStatus.ACCEPTED_ON_L2,
        REJECT: TransactionStatus.REJECTED,
      },
    },
    [TransactionStatus.ACCEPTED_ON_L2]: {
      on: {
        ADVANCE: TransactionStatus.ACCEPTED_ON_L1,
        REJECT: TransactionStatus.REJECTED,
      },
    },
    [TransactionStatus.ACCEPTED_ON_L1]: {},
    [TransactionStatus.REJECTED]: {
      on: {
        ADVANCE: TransactionStatus.NOT_RECEIVED,
      },
    },
  },
});

export const useTransactionStatus = () => {
  return useMachine(transactionStateMachine);
};

export const useTransaction = (
  transactionHash?: string,
  polling?: number
): { transaction: TransactionInfo | null; loading: boolean } => {
  const { library: provider } = useStarknet();

  const pollingInterval = polling || 2000;

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let heartbeat: NodeJS.Timer | false;

    const getLatestStatus = async () => {
      if (transactionHash && transactionHash !== "") {
        let tx_status;

        const response = await provider.getTransactionStatus(transactionHash);
        tx_status = response.tx_status as TransactionStatus;
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
  }, [transactionHash, polling, provider, pollingInterval]);

  return { transaction: findTransaction(transactionHash), loading };
};
