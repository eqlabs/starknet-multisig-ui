import { ReactNode } from "react";

export type SSRProps = {
  children?: ReactNode;
  contractAddress: string;
};

export type TransactionInfo = {
  hash: string;
  status: TransactionStatus;
};

export type MultisigInfo = {
  address: string;
  signers?: string[];
  threshold?: number;
  transactionHash?: string;
  transactions: MultisigTransaction[];
};

export type WalletInfo = {
  id?: string;
  address?: string;
};

export type TokenInfo = {
  symbol: string;
  decimals: number;
};

export type MultisigTransaction = {
  nonce: number;
  to: string;
  function_selector: string;
  calldata_len: number;
  calldata: string[];
  executed: boolean;
  confirmations: number;
  latestTransactionHash?: string;
};

export enum TransactionStatus {
  NOT_RECEIVED = "NOT_RECEIVED",
  RECEIVED = "RECEIVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  ACCEPTED_ON_L2 = "ACCEPTED_ON_L2",
  ACCEPTED_ON_L1 = "ACCEPTED_ON_L1",
}

export const pendingStatuses = [
  TransactionStatus.NOT_RECEIVED,
  TransactionStatus.RECEIVED,
  TransactionStatus.PENDING,
  TransactionStatus.REJECTED,
];

export type ComparisonRange = -1 | 0 | 1;

export type NetworkName = "mainnet-alpha" | "goerli-alpha";
