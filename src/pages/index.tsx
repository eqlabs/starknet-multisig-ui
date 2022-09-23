import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import Box from "~/components/Box";
import { ConnectWallet } from "~/components/ConnectWallet";
import Header from "~/components/Header";

const Home: NextPage = () => (
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
        <ConnectWallet />
      </AnimatePresence>
    </Box>
  </Box>
);

export default Home;
