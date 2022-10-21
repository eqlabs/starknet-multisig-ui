import { Provider } from "starknet";
import { NetworkName } from "~/types";

export const rpcUrl =
  process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:5050";

export const networkName: NetworkName =
  (process.env.NEXT_PUBLIC_NETWORK as NetworkName) || "goerli-alpha";

export const defaultProvider = new Provider({
  sequencer: {
    network: networkName,
  },
});

export const voyagerBaseUrl =
  process.env.NEXT_PUBLIC_VOYAGER_BASE_URL || "https://goerli.voyager.online/";
