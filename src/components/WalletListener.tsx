import core from "get-starknet-core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { state } from "~/state";

const WalletListener = () => {
  const router = useRouter();
  const { walletInfo, accountInterface } = useSnapshot(state);
  useEffect(() => {
    const reconnect = async () => {
      const availableWallets = await core.getAvailableWallets()
      const connected = availableWallets.find(wallet => wallet.isConnected)

      if (!accountInterface && !walletInfo) {
        router.asPath !== "/" && router.push("/")
      } else if (!connected && walletInfo && walletInfo.id) {
        console.log("ebin!", walletInfo)
        const connector = availableWallets.find((wallet) => wallet.id === walletInfo.id)
        if (connector) {
          connector.enable().then((connectedAccount) => {
            state.walletInfo = { ...walletInfo, address: connectedAccount.toString() }
            state.accountInterface = connector.account
          });
        } else {
          router.asPath !== "/" && router.push("/")
        }
      }
    }
    
    reconnect()
  }, [accountInterface, router, walletInfo])
  
  return <></>
}

export default WalletListener
