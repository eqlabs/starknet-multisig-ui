import { SequencerProvider } from "starknet";
import { NetworkName } from "~/types";

export const rpcUrl =
  process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:5050";

export const networkName: NetworkName =
  (process.env.NEXT_PUBLIC_NETWORK as NetworkName) || "goerli-alpha";

export const defaultProvider = new SequencerProvider({
  network: networkName,
});

export const voyagerBaseUrl =
  process.env.NEXT_PUBLIC_VOYAGER_BASE_URL || "https://goerli.voyager.online/";

export const classHash =
  process.env.NEXT_PUBLIC_CONTRACT_CLASS_HASH ||
  "0x6a160823ef631db9116704efa7b081c8574177228bb120b098f9646e5f7403c";
