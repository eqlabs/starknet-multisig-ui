import { InjectedConnector, StarknetConfig } from "@starknet-react/core";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import WalletListener from "~/components/WalletListener";
import { defaultProvider } from "~/utils/config";
import { darkTheme } from "../../stitches.config";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const connectors = [
    new InjectedConnector({ options: { id: 'braavos' }}),
    new InjectedConnector({ options: { id: 'argentX' }}),
  ]
  return (
    <StarknetConfig connectors={connectors} defaultProvider={defaultProvider}>
      <WalletListener />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        value={{
          light: "light",
          dark: darkTheme.className,
        }}
      >
        <NextHead>
          <title>Starsign — StarkNet Multisig</title>
        </NextHead>
        <Component {...pageProps} />
      </ThemeProvider>
    </StarknetConfig>
  );
}

export default MyApp;
