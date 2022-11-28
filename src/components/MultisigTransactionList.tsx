import { useStarknet } from "@starknet-react/core";
import { styled } from "@stitches/react";
import throttle from "lodash/throttle";
import { useCallback, useEffect, useState } from "react";
import { Contract, number, uint256 } from "starknet";
import { addMultisigTransaction, findTransaction, getTokenInfo } from "~/state/utils";
import { MultisigTransaction, TransactionStatus } from "~/types";
import { compareStatuses, formatAmount, getMultisigTransactionInfo, getVoyagerContractLink, truncateAddress } from "~/utils";
import { StyledButton } from "./Button";
import { PencilLine } from "./Icons";

const TransactionWrapper = styled("li", {
  listStyle: "none",
  margin: "0",
  padding: "$3 0",
  textIndent: "0",
  display: "flex",
  flexDirection: "row",
  borderBottom: "1px $borderBottom solid",
  justifyContent: "space-between",
  alignItems: "center",
})

const TransactionType = styled("small", {
  borderRadius: "9999px",
  background: "$txBg",
  padding: "$1 $3",
  textTransform: "uppercase",
  fontSize: "10px",
  variants: {
    transfer: {
      true: {
        background: "$transferBg"
      }
    }
  }
})

const Signatures = styled("span", {
  color: "$error",
  fontFamily: "$monospace",
  letterSpacing: "0.5rem",
  marginRight: "0.5rem",
  display: "flex",
  flexDirection: "row",
  gap: "0.5rem",
  alignItems: "center",
  variants: {
    approved: {
      true: {
        color: "$success"
      }
    }
  }
})

type TransactionProps = {
  multisigContract?: Contract, threshold: number, transaction: MultisigTransaction, key: string
}

const Transaction = ({ multisigContract, threshold, transaction }: TransactionProps) => {
  const { library: provider } = useStarknet();
  const [idleDelay, activeDelay] = [60000, 5000]

  const getInteractionReadiness = useCallback(() => {
    const cachedTransaction = findTransaction(transaction.latestTransactionHash);
    return compareStatuses(cachedTransaction?.status || TransactionStatus.NOT_RECEIVED, TransactionStatus.ACCEPTED_ON_L2) < 0
  }, [transaction.latestTransactionHash]);

  useEffect(() => {
    let heartbeat: NodeJS.Timer | false;
    let latestStatus: TransactionStatus = TransactionStatus.NOT_RECEIVED;

    const cachedTransaction = findTransaction(transaction.latestTransactionHash);

    const getLatestStatus = async () => {
      if (multisigContract && transaction && transaction.latestTransactionHash && transaction.latestTransactionHash !== "") {
        // Get the latest transaction status and stop polling if it has been finalized
        const response = await provider.getTransactionReceipt(transaction.latestTransactionHash);
        latestStatus = response.status as TransactionStatus;

        // Update transaction with newest status
        latestStatus !== undefined &&
        addMultisigTransaction(multisigContract.address, transaction, { hash: transaction.latestTransactionHash, status: latestStatus });
        
        // Switch to polling the whole multisig transaction when the latest transaction has finished
        if (compareStatuses(latestStatus, TransactionStatus.ACCEPTED_ON_L2) >= 0) {
          heartbeat && clearInterval(heartbeat);
          heartbeat = setInterval(getMultisigTransaction, idleDelay);
        }
      }
    };

    const getMultisigTransaction = throttle(async () => {
      if (multisigContract) {
        const info = await getMultisigTransactionInfo(multisigContract, transaction.nonce);
        addMultisigTransaction(multisigContract.address, info);
      }
    }, activeDelay / 2);
    
    // If the latest transaction is already finalized, no need to poll for it
    if (cachedTransaction && compareStatuses(cachedTransaction?.status, TransactionStatus.ACCEPTED_ON_L2) < 0) {
      getLatestStatus();
      heartbeat = setInterval(getLatestStatus, activeDelay);
    } else if (multisigContract) {
      heartbeat = setInterval(getMultisigTransaction, idleDelay);
    }

    return () => {
      heartbeat && clearInterval(heartbeat);
    };
  }, [activeDelay, idleDelay, multisigContract, provider, transaction])

  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  useEffect(() => {
    const getTokenSymbol = async () => {
      if (multisigContract) {
        const tokenInfo = await getTokenInfo(transaction.to)
        tokenInfo && setTokenSymbol(tokenInfo.symbol)
      }
    }
    multisigContract && getTokenSymbol()
  }, [multisigContract, multisigContract?.address, transaction.to])

  const confirm = async (nonce: number) => {
    try {
      if (multisigContract) {
        const transactionReceipt = await multisigContract.confirm_transaction(nonce)
        addMultisigTransaction(multisigContract.address, transaction, { hash: transactionReceipt.transaction_hash, status: transactionReceipt.code })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const execute = async (nonce: number) => {
    try {
      if (multisigContract) {
        const transactionReceipt = await multisigContract?.execute_transaction(nonce)
        addMultisigTransaction(multisigContract.address, transaction, { hash: transactionReceipt.transaction_hash, status: transactionReceipt.code })
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  return (<TransactionWrapper>
    <TransactionType transfer={transaction.function_selector === "transfer"}>{transaction.function_selector === "transfer" ? "transfer" : "transaction"}</TransactionType>
    
    <span>Target: <a href={getVoyagerContractLink(transaction.to)} rel="noreferrer noopener" target="_blank">{truncateAddress(transaction.to)}</a></span>

    {transaction.function_selector === "transfer" &&
      <span>
        {formatAmount(uint256.uint256ToBN({ low: transaction.calldata[1], high: transaction.calldata[2] }).toString(), 18)} {tokenSymbol} to 
        {" "} <a href={getVoyagerContractLink(number.toHex(number.toBN(transaction.calldata[0])))} rel="noreferrer noopener" target="_blank">{truncateAddress(number.toHex(number.toBN(transaction.calldata[0])))}</a>
      </span>
    }

    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
      <Signatures approved={transaction.confirmations === threshold}><PencilLine css={{stroke: "$textMuted"}}/>{transaction.confirmations + "/" + threshold}</Signatures>
      <div>
        {transaction.confirmations < threshold ? <StyledButton disabled={!getInteractionReadiness()} size="sm" onClick={() => confirm(transaction.nonce)}>Confirm</StyledButton> : <StyledButton disabled={!getInteractionReadiness() && transaction.confirmations < threshold} size="sm" onClick={() => execute(transaction.nonce)}>Execute</StyledButton>
        }
      </div>
    </div>
  </TransactionWrapper>)
}

const MultisigTransactionList = ({multisigContract, threshold, transactions}: {multisigContract?: Contract, threshold: number, transactions?: MultisigTransaction[]}) => {
  return (<ul style={{ display: "flex", flexDirection: "column", position: "relative", margin: "0", padding: "0"}}>
      {transactions?.filter(transaction => !transaction.executed).map(transaction => (
        <Transaction multisigContract={multisigContract} threshold={threshold} transaction={transaction} key={`multisigTransaction-${transaction.nonce}`} />
      ))}
    </ul>
  );
}

export default MultisigTransactionList;
