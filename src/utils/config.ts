import { Provider } from "starknet";

export const rpcUrl =
  process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:5050";

export const defaultProvider = new Provider({
  rpc: { nodeUrl: rpcUrl },
});

export const voyagerBaseUrl =
  process.env.NEXT_PUBLIC_VOYAGER_BASE_URL || "https://goerli.voyager.online/";
