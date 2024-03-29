import {
  Abi,
  Contract,
  getChecksumAddress,
  validateAndParseAddress,
} from "starknet";
import { snapshot } from "valtio";
import {
  MultisigInfo,
  MultisigTransaction,
  TokenInfo,
  TransactionInfo,
  TransactionStatus,
} from "~/types";
import { fetchTokenDecimals, fetchTokenSymbol, matchAddress } from "~/utils";
import { defaultProvider } from "~/utils/config";
import { state } from ".";
import ERC20Source from "../../public/erc20.json";

/**
 * State utils for commonly used tasks regarding the valtio state.
 * NOTE: Beware of using these in the place of useSnapshot,
 * as they will not trigger a rerender in some cases.
 *  */

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
  const multisig = state.multisigs?.find((contract) =>
    matchAddress(contract.address, address || "")
  );
  return multisig || null;
};

export const deleteMultisigFromCache = (address?: string) => {
  state.multisigs = state.multisigs.filter(
    (contract) => !matchAddress(contract.address, address || "")
  );
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
  const { transactions } = snapshot(state);
  const transaction = transactions?.find(
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

export const getTokenInfo = async (
  tokenAddress: string
): Promise<TokenInfo | null> => {
  const { tokenInfo } = snapshot(state);
  const validatedAddress = getChecksumAddress(
    validateAndParseAddress(tokenAddress)
  );

  // Get token info from cache if possible
  let returnedTokenInfo = tokenInfo ? tokenInfo[validatedAddress] : null;

  // If no cache was found, fetch info on-chain
  if (validatedAddress && !returnedTokenInfo) {
    try {
      const targetContract = new Contract(
        ERC20Source.abi as Abi,
        tokenAddress,
        defaultProvider
      );

      const symbol = await fetchTokenSymbol(tokenAddress, targetContract);
      const decimals = await fetchTokenDecimals(tokenAddress, targetContract);

      state.tokenInfo[validatedAddress] = { symbol, decimals };
      returnedTokenInfo = { symbol, decimals };
    } catch (e) {
      console.error(e);
    }
  }

  return returnedTokenInfo;
};
