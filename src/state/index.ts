import { IStarknetWindowObject } from "@argent/get-starknet/dist";
import { AccountInterface } from "starknet";
import { proxy, subscribe } from "valtio";
import { MultisigInfo, TokenInfo, TransactionInfo, WalletInfo } from "~/types";

export type State = {
  walletInfo: false | WalletInfo;
  wallet?: IStarknetWindowObject;
  accountInterface?: AccountInterface;
  multisigs: Array<MultisigInfo>;
  transactions: Array<TransactionInfo>;
  tokenInfo: { [tokenAddress: string]: TokenInfo };
};

const storeKey = "starsign-state";

const defaultState: State = {
  walletInfo: false,
  wallet: undefined,
  accountInterface: undefined,
  multisigs: [],
  transactions: [],
  tokenInfo: {},
};

const persistState = (state: State) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(storeKey, JSON.stringify(state));
  }
};

let initialState: State = defaultState;
if (typeof window !== "undefined") {
  try {
    const storedState = localStorage.getItem(storeKey);
    if (storedState) {
      initialState = JSON.parse(storedState);
    } else {
      persistState(defaultState);
    }
  } catch (_e) {
    console.warn(
      "Encountered an error while fetching persisted state, defaulting.",
      _e
    );
    initialState = defaultState;
  }
}

export const state = proxy<State>(initialState);

if (typeof window !== "undefined") {
  subscribe(state, () => {
    persistState(state);
  });
}
