import { snapshot } from "valtio";
import {
  MultisigInfo,
  MultisigTransaction,
  TransactionInfo,
  TransactionStatus,
} from "~/types";
import { state } from ".";

export const updateTransactionStatus = (
  hash: string,
  newStatus: TransactionStatus
) => {
  const { transactions } = snapshot(state);

  const transactionIndex =
    transactions?.findIndex((transaction) => transaction.hash === hash) || -1;
  const newTransactionStatus = { hash: hash, status: newStatus };

  if (transactionIndex > -1) {
    state.transactions[transactionIndex] = newTransactionStatus;
  } else {
    state.transactions.push(newTransactionStatus);
  }
};

export const findMultisig = (address?: string) => {
  const multisig = state.multisigs?.find(
    (contract) => contract.address === address
  );
  return multisig || null;
};

export const updateMultisigInfo = (multisigInfo: MultisigInfo) => {
  state.multisigs = state.multisigs.map((contract) => {
    if (multisigInfo.address.toLowerCase() === contract.address.toLowerCase()) {
      contract = multisigInfo;
    }
    return contract;
  });
};

export const findTransaction = (transactionHash?: string) => {
  const transaction = state.transactions?.find(
    (transaction) => transaction.hash === transactionHash
  );
  return transaction || null;
};

export const addMultisigTransaction = (
  multisigAddress: string,
  multisigTransaction: MultisigTransaction,
  transactionInfo?: TransactionInfo
) => {
  const multisig = findMultisig(multisigAddress);
  // Try/catch because of validateAndParseAddress can throw an error
  try {
    if (multisig) {
      if (!multisig.transactions) {
        multisig.transactions = [];
      } else {
        // Check if the transaction exists already
        const foundTransactionIndex = multisig.transactions.findIndex(
          (transaction) => transaction.nonce === multisigTransaction.nonce
        );

        // If additional information about the transaction is given, add to state
        if (transactionInfo) {
          multisigTransaction.latestTransactionHash = transactionInfo.hash;
          updateTransactionStatus(transactionInfo.hash, transactionInfo.status);
        }

        // If transaction exists, update it, if not, append it to the multisig state
        if (foundTransactionIndex > -1) {
          console.log("Found it! New info: ", multisigTransaction);
          multisig.transactions[foundTransactionIndex] = multisigTransaction;
        } else {
          multisig.transactions.push(multisigTransaction);
        }
      }
    } else {
      console.error("No matching multisig contract in state!");
    }
  } catch (_e) {
    console.error(_e);
  }
};
