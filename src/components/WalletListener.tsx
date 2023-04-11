import core from "get-starknet-core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { state } from "~/state";

const WalletListener = () => {
  const router = useRouter();
  const { walletInfo, wallet } = useSnapshot(state);
  useEffect(() => {
    const reconnect = async () => {
      const availableWallets = await core.getAvailableWallets()
      
      if (!wallet?.account && !walletInfo) {
        router.asPath !== "/" && router.push("/")
      } else if (walletInfo && !walletInfo.address && wallet?.account) {
        state.walletInfo = { ...walletInfo, address: wallet.account.address }
      } else if (walletInfo && walletInfo.id && !wallet?.account) {
        const connector = availableWallets.find((wallet) => wallet.id === walletInfo.id)
        if (connector) {
          connector.enable().then((connectedAccount) => {
            state.walletInfo = { ...walletInfo, address: connectedAccount.toString() }
          });
        } else {
          router.asPath !== "/" && router.push("/")
        }
      }
    }
    reconnect()
  }, [router, wallet?.account, walletInfo])
  
  return <></>
}

export default WalletListener
