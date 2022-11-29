import { getInstalledInjectedConnectors, InjectedConnector, useStarknet } from "@starknet-react/core";
import { styled } from "@stitches/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import Paragraph from "~/components/Paragraph";
import { state } from "~/state";
import { mapWalletIdToIcon, mapWalletToText } from "~/utils";

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
    if (pendingWallet) {
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
            StarSign is an open-source project that lets you create and sign multisig contracts on the StarkNet. Starsign works on your browser and currently supports <a href="https://www.argent.xyz/argent-x/" target="_blank" rel="noreferrer noopener">ArgentX</a> & <a href="https://braavos.app/" target="_blank" rel="noreferrer noopener">Braavos</a> wallets.
            <br /><br />
            <a href="https://github.com/eqlabs/starknet-multisig-ui" target="_blank" rel="noreferrer">View code on GitHub</a>, and <a href="https://discord.gg/Dt5a5Uus3t" target="_blank" rel="noreferrer noopener">ask for support on our Discord</a>.
          </Paragraph>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {getInstalledInjectedConnectors().map(wallet => (
            <Button size="md" key={wallet.id()} fullWidth style={{background: "#EFF4FB", color: "#000000", whiteSpace: "nowrap"}} onClick={() => connectCallback(wallet)}>
              {mapWalletIdToIcon(wallet.id())} <span>Connect wallet ({mapWalletToText(wallet)})</span>
            </Button>
          ))}
          </div>
        </div>
      </>) : (<Paragraph css={{ fontSize: "$lg", margin: "$6 0", color: "#FFFFFF" }}>
        Unlock your {mapWalletToText(pendingWallet)} wallet.
      </Paragraph>)}
    </FrontPageWrapper>
  );
}
