import { useAccount, useConnectors } from "@starknet-react/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { state } from "~/state";

const WalletListener = () => {
  const router = useRouter();
  const { connectors } = useConnectors();
  const { account } = useAccount();
  const { walletInfo } = useSnapshot(state);

  useEffect(() => {
    if (!account && !walletInfo) {
      router.asPath !== "/" && router.push("/")
    } else if (walletInfo && !walletInfo.address && account) {
      state.walletInfo = { ...walletInfo, address: account.address }
    } else if (walletInfo && walletInfo.id && !account) {
      const connector = connectors.find(connector => connector.id() === walletInfo.id)
      if (connector) {
        connector.connect().then((connectedAccount) => {
          state.walletInfo = { ...walletInfo, address: connectedAccount.address }
        });
      } else {
        router.asPath !== "/" && router.push("/")
      }
    }
  }, [account, connectors, router, walletInfo])
  
  return <></>
}

export default WalletListener
