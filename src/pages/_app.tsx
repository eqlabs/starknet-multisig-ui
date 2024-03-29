import { ThemeProvider } from "next-themes"
import type { AppProps } from "next/app"
import NextHead from "next/head"
import WalletListener from "~/components/WalletListener"
import { darkTheme } from "../../stitches.config"

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      value={{
        light: "light",
        dark: darkTheme.className
      }}
    >
      <NextHead>
        <title>Starsign — StarkNet Multisig</title>
      </NextHead>
      <WalletListener />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
