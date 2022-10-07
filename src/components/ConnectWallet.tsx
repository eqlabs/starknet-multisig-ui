import { getInstalledInjectedConnectors, InjectedConnector, useStarknet } from "@starknet-react/core";
import { styled } from "@stitches/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import Paragraph from "~/components/Paragraph";
import { state } from "~/state";
import { mapWalletIdToText } from "~/utils";

const WelcomeTitle = styled("h1", { fontSize: "$6xl", marginBottom: "$1" });
const Subtitle = styled("h2", { fontSize: "$2xl", marginTop: "0", fontWeight: "normal" });
const FrontPageWrapper = styled(motion.div, { boxSizing: "border-box",
width: "100%",
maxWidth: "$4xl", color: "#FFFFFF" })

export const ConnectWallet = () => {
  const router = useRouter();
  const { account, connect } = useStarknet();
  const [pendingWallet, setPendingWallet] = useState<InjectedConnector | undefined>();

  const connectCallback = async (wallet: InjectedConnector) => {
    setPendingWallet(wallet);
    connect(wallet);
  };

  useEffect(() => {
    if (pendingWallet && account) {
      state.walletInfo = { id: pendingWallet.id(), address: account }
    }
  }, [account, pendingWallet, router]);

  return (
    <FrontPageWrapper>
      <WelcomeTitle>Welcome to Starsign</WelcomeTitle>
      <Subtitle>Multi-signature functionality for StarkNet</Subtitle>
      <hr style={{ border: "1px solid #FFFFFF"}}/>
      {!pendingWallet ? (<>
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem", justifyContent: "space-between" }}>
          <Paragraph css={{ fontSize: "$lg", margin: "0", color: "#FFFFFF", width: "$xl", alignItems: "flex-start", justifyContent: "flex-start" }}>
            StarSign is an open-source project that lets you create and sign multisig contracts on the StarkNet. Starsign works on your browser and currently supports ArgentX & Braavos wallets.
            <br /><br />
            View code on GitHub.
          </Paragraph>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {getInstalledInjectedConnectors().map(wallet => (
            <Button size="md" key={wallet.id()} fullWidth style={{background: "#EFF4FB", color: "#000000"}} onClick={() => connectCallback(wallet)}>
              Connect wallet ({mapWalletIdToText(wallet)})
            </Button>
          ))}
          </div>
        </div>
      </>) : (<Paragraph css={{ fontSize: "$lg", margin: "$6 0", color: "#FFFFFF" }}>
        Unlock your {mapWalletIdToText(pendingWallet)} wallet.
      </Paragraph>)}
    </FrontPageWrapper>
  );
}
