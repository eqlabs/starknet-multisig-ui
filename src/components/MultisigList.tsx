import { styled } from "@stitches/react"
import Link from "next/link"
import { FiCopy, FiX } from "react-icons/fi"
import { useSnapshot } from "valtio"
import { state } from "~/state"
import { deleteMultisigFromCache } from "~/state/utils"
import { truncateAddress } from "~/utils"
import { ClockCounterClockwise, Hourglass, PencilLine, RightArrow, User } from "./Icons"
import InnerContainer, { InnerContainerTitle } from "./InnerContainer"

const Multisig = styled("div", {
  margin: "$4 0",
  overflow: "hidden",
  position: "relative",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: "$4",
  maxWidth: "100%",
  variants: {
    inactive: {
      true: {
        opacity: "0.5"
      }
    }
  }
})

export const Address = styled("span", {
  fontFamily: "$monospace",
  display: "flex",
  flexDirection: "row",
  gap: "$4",
  alignItems: "center"
})

export const ContractInfo = styled("span", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  color: "$textMuted",
  gap: "0.5rem"
})

const LinkWrapper = styled("div", {
  position: "relative",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  "&:hover > span": {
    textDecoration: "underline"
  }
})

const InvisibleButton = styled("button", {
  background: "transparent",
  border: "0",
  padding: "0",
  margin: "0",
  cursor: "pointer"
})

const MultisigList = () => {
  const { multisigs } = useSnapshot(state)
  return (
    <InnerContainer css={{ marginTop: "$6", gap: "0" }}>
      <InnerContainerTitle>
        <ClockCounterClockwise css={{ stroke: "$text" }} />
        VISITED MULTISIGS
      </InnerContainerTitle>

      {multisigs?.map((contract) => (
        <Multisig
          key={`contractList-${contract.address}`}
          css={{
            margin: "0",
            padding: "$4 0",
            borderBottom: "1px $borderColor solid"
          }}
        >
          <LinkWrapper>
            <Address>
              <InvisibleButton onClick={() => deleteMultisigFromCache(contract.address)}>
                <FiX size="17px" />
              </InvisibleButton>
              <InvisibleButton onClick={() => navigator.clipboard.writeText(contract.address)}>
                <FiCopy size="17px" />
              </InvisibleButton>
              <Link href={`/multisig/${contract.address}`} passHref>
                {truncateAddress(contract.address, 14)}
              </Link>
            </Address>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                alignItems: "center"
              }}
            >
              <ContractInfo
                title={`This multisig has ${contract.signers?.length} approved signers.`}
              >
                {contract.signers?.length}
                <User css={{ stroke: "$textMuted" }} />
              </ContractInfo>
              <ContractInfo
                title={`This multisig needs ${contract.threshold} signatures to execute a transaction.`}
              >
                {contract.threshold}
                <PencilLine css={{ stroke: "$textMuted" }} />
              </ContractInfo>
              <ContractInfo
                title={`This multisig has ${
                  contract.transactions.filter((tx) => !tx.executed).length
                } pending transactions.`}
              >
                {contract.transactions.filter((tx) => !tx.executed).length}
                <Hourglass css={{ stroke: "$textMuted" }} width="16" height="17" />
              </ContractInfo>
              <Link href={`/multisig/${contract.address}`} passHref>
                <RightArrow
                  css={{
                    flexShrink: "0",
                    stroke: "$text",
                    height: "3rem",
                    width: "3rem"
                  }}
                />
              </Link>
            </div>
          </LinkWrapper>
        </Multisig>
      ))}
    </InnerContainer>
  )
}

export default MultisigList
