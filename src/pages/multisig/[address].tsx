import { AnimatePresence } from "framer-motion"
import type { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { getChecksumAddress, validateAndParseAddress } from "starknet"
import BorderedContainer from "~/components/BorderedContainer"
import Box from "~/components/Box"
import { ExistingMultisig } from "~/components/ExistingMultisig"
import Header from "~/components/Header"
import { state } from "~/state"
import { findMultisig } from "~/state/utils"
import { SSRProps } from "~/types"

const Contract: NextPage<SSRProps> = ({ contractAddress }) => {
  const router = useRouter()
  const [validatedAddress, setValidatedAddress] = useState<string>()

  useEffect(() => {
    try {
      const address = getChecksumAddress(validateAndParseAddress(contractAddress))
      if (address) {
        setValidatedAddress(address)
        if (!findMultisig(address)) {
          state.multisigs.push({ address: address, transactions: [] })
        }
      } else {
        router.push("/")
      }
    } catch (e) {
      router.push("/")
    }
  }, [contractAddress, router])

  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: "0 $6"
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
          position: "relative"
        }}
      >
        <AnimatePresence exitBeforeEnter>
          <BorderedContainer
            key="connected-account"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{
              y: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            {validatedAddress && <ExistingMultisig contractAddress={validatedAddress} />}
          </BorderedContainer>
        </AnimatePresence>
      </Box>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const contractAddress = params?.address
  return {
    props: {
      contractAddress
    }
  }
}

export default Contract
