import { styled } from "@stitches/react";
import Link from "next/link";
import { useSnapshot } from "valtio";
import { state } from "~/state";
import { truncateAddress } from "~/utils";
import { ClockCounterClockwise, Hourglass, PencilLine, RightArrow, User } from "./Icons";
import InnerContainer, { InnerContainerTitle } from "./InnerContainer";

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
        opacity: "0.5",
      }
    }
  },
});

export const Address = styled("span", {
  fontFamily: "$monospace",
})

export const ContractInfo = styled("span", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  color: "$textMuted",
  gap: "0.5rem",
})

const LinkWrapper = styled("div", {
  position: "relative",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  cursor: "pointer",
  "&:hover > span": {
    textDecoration: "underline"
  },
})

const MultisigList = () => {
  const { multisigs } = useSnapshot(state)
  return (
    <InnerContainer css={{marginTop: "$6", gap: "0"}}>
      <InnerContainerTitle><ClockCounterClockwise css={{stroke: "$text"}}/>VISITED MULTISIGS</InnerContainerTitle>

      {multisigs?.map((contract, index) => (
        <Multisig key={`contractList-${contract.address}`} css={{margin: "0", padding: "$4 0", borderBottom: "1px $borderColor solid"}}>
          <Link href={`/multisig/${contract.address}`} passHref>
            <LinkWrapper>
              <Address>{truncateAddress(contract.address, 14)}</Address>
              <div style={{ display: "flex", flexDirection: "row", gap: "1rem", alignItems: "center" }}>
                <ContractInfo>{contract.signers?.length}<User css={{ stroke: "$textMuted" }}/></ContractInfo>
                <ContractInfo>{contract.threshold}<PencilLine css={{ stroke: "$textMuted" }}/></ContractInfo>
                <ContractInfo>{contract.transactions.length}<Hourglass css={{ stroke: "$textMuted" }} width="16" height="17"/></ContractInfo>
                <RightArrow css={{flexShrink: "0", stroke: "$text", height: "3rem", width: "3rem"}}/>
              </div>
            </LinkWrapper>
          </Link>
        </Multisig>
      ))}
    </InnerContainer>
  )
}

export default MultisigList
