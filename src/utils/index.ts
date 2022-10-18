import { InjectedConnector } from "@starknet-react/core";
import { Contract, validateAndParseAddress } from "starknet";
import { BigNumberish, isHex, toBN, toHex } from "starknet/utils/number";
import {
  ComparisonRange,
  MultisigTransaction,
  TransactionStatus,
} from "~/types";
import { voyagerBaseUrl } from "./config";

export const shortStringFeltToStr = (felt: bigint): string => {
  const newStrB = Buffer.from(felt.toString(16), "hex");
  return newStrB.toString();
};

export const filterNonFeltChars = (input: string): string => {
  return input.replace(/[^0-9]/gi, "");
};

export const mapTargetHashToText = (hash: string): string => {
  let mapping = "";
  const map: { [key: string]: string } = {
    "232670485425082704932579856502088130646006032362877466777181098476241604910":
      "transfer",
  };
  if (Object.keys(map).includes(hash)) {
    mapping = map[hash];
  }
  return mapping;
};

export const mapWalletIdToText = (wallet: InjectedConnector): string => {
  let walletName = "";
  switch (wallet.id()) {
    case "argent-x": {
      walletName = "Argent X";
      break;
    }
    case "braavos": {
      walletName = "Braavos";
      break;
    }
    default: {
      walletName = wallet.name();
    }
  }
  return walletName;
};

export const compareStatuses = (
  a: TransactionStatus,
  b: TransactionStatus
): ComparisonRange => {
  let result: ComparisonRange = 0;

  const indexOfA = Object.keys(TransactionStatus).findIndex((key) => key === a);
  const indexOfB = Object.keys(TransactionStatus).findIndex((key) => key === b);

  if (indexOfA > indexOfB) {
    result = 1;
  } else if (indexOfA < indexOfB) {
    result = -1;
  }

  return result;
};

export const formatAmount = (
  amount: BigNumberish,
  decimals: number,
  accuracy?: number
): string => {
  const acc = accuracy || 3;
  const bnStr = amount.toString();
  const decimalIndex = bnStr.length - decimals;

  let formatted;
  if (decimalIndex > 0 && decimalIndex < bnStr.length - 1) {
    const left: string = bnStr.substring(0, decimalIndex);

    // Trim trailing zeroes
    let right: string = bnStr.substring(decimalIndex, bnStr.length);
    while (right.endsWith("0")) {
      right = right.substring(0, right.length - 1);
    }

    formatted =
      right.length === 0
        ? left
        : [
            left,
            ".",
            acc >= right.length ? right : right.substring(0, acc),
          ].join("");
  } else {
    formatted = amount.toString();
  }

  return formatted;
};

export const parseAmount = (amount: string, decimals: number): BigNumberish => {
  let parsed: string = "0";

  const decimalIndex = amount.indexOf(".");

  let additionalZeros = 0;
  if (decimalIndex > 0) {
    additionalZeros = decimals - amount.length + decimalIndex + 1;
  } else {
    additionalZeros = decimals;
  }
  const zeros = Array.from({ length: additionalZeros }, () => "0").join("");

  if (decimalIndex > 0) {
    const left = amount.substring(0, decimalIndex);
    const right = amount.substring(decimalIndex + 1, amount.length);
    parsed = [left, right, zeros].join("");
  } else {
    const left = amount;
    parsed = [left, zeros].join("");
  }

  return toBN(parsed);
};

export const truncateAddress = (address: string): string => {
  let validatedAddress = address;
  try {
    validatedAddress = validateAndParseAddress(address);
  } catch (_e) {
    console.warn(_e);
  }
  return [
    validatedAddress.substring(0, 4),
    validatedAddress.substring(
      validatedAddress.length - 4,
      validatedAddress.length
    ),
  ].join("…");
};

export const getVoyagerTransactionLink = (txHash: string): string => {
  return voyagerBaseUrl + "tx/" + txHash;
};

export const getVoyagerContractLink = (contractAddress: string): string => {
  return voyagerBaseUrl + "contract/" + contractAddress;
};

export const getMultisigTransactionInfo = async (
  contract: Contract,
  currentTransactionIndex: number
) => {
  const { tx: transaction, tx_calldata: calldata } =
    await contract.get_transaction(currentTransactionIndex);

  const formattedTransaction: MultisigTransaction = {
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

  return formattedTransaction;
};

export const parseMultisigTransaction = (
  rawMultisigTransaction: any
): MultisigTransaction => {
  const parsedTransaction: MultisigTransaction = {
    nonce: rawMultisigTransaction.nonce.toNumber(),
    to: rawMultisigTransaction.targetAddress,
    function_selector: mapTargetHashToText(
      isHex(rawMultisigTransaction.targetFunctionSelector)
        ? toBN(rawMultisigTransaction.targetFunctionSelector)
        : rawMultisigTransaction.targetFunctionSelector.toString()
    ),
    calldata: rawMultisigTransaction.callData.map((data: any) =>
      typeof data === "string" ? toBN(data) : toBN(data.toString())
    ),
    calldata_len: rawMultisigTransaction.callData.length,
    executed: rawMultisigTransaction.executed,
    threshold: rawMultisigTransaction.threshold,
  };
  return parsedTransaction;
};
