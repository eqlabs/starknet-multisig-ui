import { useStarknet } from "@starknet-react/core";
import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useSnapshot } from "valtio";
import BorderedContainer from "~/components/BorderedContainer";
import Box from "~/components/Box";
import { ConnectWallet } from "~/components/ConnectWallet";
import { Legend } from "~/components/Forms";
import Header from "~/components/Header";
import { AdvanceButton } from "~/components/Input";
import MultisigAddressInput from "~/components/MultisigAddressInput";
import MultisigList from "~/components/MultisigList";
import { state } from "~/state";

const Multisigs = () => {
  const { multisigs } = useSnapshot(state);
  return <>{multisigs?.length > 0 && (
    <MultisigList />
  )}</>
}

const Home: NextPage = () => {
  const { account } = useStarknet();
  const router = useRouter();
  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: "0 $6",
      }}
    >
      <Header />
      <Box
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: "1",
          position: "relative",
        }}
      >
        <AnimatePresence exitBeforeEnter>
          {account ? 
            <>
              <BorderedContainer
                key="new-multisig-button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{
                  y: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                style={{ display: "flex", marginBottom: "1rem", flexDirection: "row", justifyContent: "space-between" }}
              >
                <Legend as="h2">Create a new multisig</Legend>
                <AdvanceButton onClick={() => router.push("/create")}/>
              </BorderedContainer>
              <BorderedContainer
                key="existing-multisigs-form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{
                  y: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                <Legend as="h2">Use an existing multisig</Legend>
                <hr />
                <MultisigAddressInput />
                <Multisigs />
              </BorderedContainer>
            </>
          : <ConnectWallet />}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

export default Home;
