import { AnimatePresence } from "framer-motion";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { getChecksumAddress, validateAndParseAddress } from "starknet";
import BorderedContainer from "~/components/BorderedContainer";
import Box from "~/components/Box";
import DeploymentStatus from "~/components/DeploymentStatus";
import Header from "~/components/Header";
import { useTransaction } from "~/hooks/transactionStatus";
import { state } from "~/state";
import { findMultisig } from "~/state/utils";
import { TransactionStatus, pendingStatuses } from "~/types";
import { getVoyagerTransactionLink } from "~/utils";

type DeploymentProps = {
  tx: string
}

const Deployment = ({tx}: DeploymentProps) => {
  const transactionLink = getVoyagerTransactionLink(tx || "");
  const { transaction, receipt } = useTransaction(tx, 5000);
  const router = useRouter();

  // Listens to events from the receipt and parses the address from the UDC when the transaction reaches PENDING status
  const getParsedAddress = useCallback(() => {
    const address = receipt?.events && receipt.events[1]?.from_address;
    const parsedAddress = validateAndParseAddress(getChecksumAddress(address));
    return parsedAddress;
  }, [receipt?.events])

  // Listens to the receipt and adds the deployed multisig to state and redirects to it when it is available on L2
  useEffect(() => {
    const address = getParsedAddress();
    if (address && receipt) {
      if (!findMultisig(address)) {
        state.multisigs.push({
          address: address,
          transactionHash: receipt.transaction_hash,
          transactions: [],
        });
      }
      if (!pendingStatuses.includes(receipt.status as TransactionStatus)) {
        router.push(`/multisig/${address}`);
      }
    }
  }, [getParsedAddress, receipt, router])

  return <Box
    css={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      padding: "0 $6",
    }}
  >
    <>
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
          <BorderedContainer
            key="connected-account"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{
              y: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <>
              <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <span>Deploying...</span>
                <Link href={transactionLink}>{"See transaction on Voyager"}</Link>
              </div>

              <DeploymentStatus status={transaction?.status || TransactionStatus.NOT_RECEIVED} />
            </>
          </BorderedContainer>
        </AnimatePresence>
      </Box>
    </>
  </Box>
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
}) => {
  const tx = params?.tx
  return {
    props: {
      tx
    }
  }
}

export default Deployment
