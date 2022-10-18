import * as Tabs from '@radix-ui/react-tabs';
import {
  useStarknet
} from "@starknet-react/core";
import { styled } from '@stitches/react';
import Link from "next/link";
import { useEffect, useState } from 'react';
import { validateAndParseAddress } from 'starknet';
import { useMultisigContract } from "~/hooks/multisigContractHook";
import { findMultisig } from '~/state/utils';
import { pendingStatuses } from '~/types';
import { getVoyagerContractLink, getVoyagerTransactionLink } from '~/utils';
import ArbitraryTransaction from './ArbitraryTransaction';
import DeploymentStatus from './DeploymentStatus';
import Erc20Transaction from './Erc20Transaction';
import { Legend } from "./Forms";
import InnerContainer, { InnerContainerTitle } from './InnerContainer';
import MultisigTransactionList from './MultisigTransactionList';
import SkeletonLoader from './SkeletonLoader';

interface MultisigProps {
  contractAddress: string
}

const StyledTabs = styled(Tabs.List, {
  width: "100%",
  position: "relative",
  display: "flex",
  flexDirection: "row",
  height: "$12",
});

const StyledTrigger = styled(Tabs.Trigger, {
  display: "flex",
  height: "$10",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexGrow: 1,
  background: "transparent",
  border: "1px solid $text",
  padding: "$1",
  color: "$textMuted",
  fontFamily: "$body",
  fontSize: "$md",
  '&[data-state="active"]': {
    color: "$text",
    background: "$buttonActive"
  },
  variants: {
    right: {
      true: {
        borderRadius: "0px 32px 32px 0px"
      }
    },
    left: {
      true: {
        borderRadius: "32px 0px 0px 32px"
      }
    }
  }
});

export const ExistingMultisig = ({ contractAddress }: MultisigProps) => {
  const { account } = useStarknet();
  const { contract: multisigContract, status, loading, signers, threshold } = useMultisigContract(
    contractAddress, 20000
  );
  
  const [firstLoad, setFirstLoad] = useState<boolean>(true)
  const [pendingStatus, setPendingStatus] = useState<boolean>(false)

  const multisig = findMultisig(contractAddress)

  const transactionFound = multisig?.transactionHash
  const transactionLink = getVoyagerTransactionLink(contractAddress);
  const contractLink = getVoyagerContractLink(contractAddress);

  useEffect(() => {
    if (!loading) {
      if (!pendingStatuses.includes(status)) {
        const delay = firstLoad ? 0 : 2000
        setTimeout(() => {
          setPendingStatus(false)
        }, delay)
        setFirstLoad(false)
      } else {
        setPendingStatus(true)
      }
    }
  }, [firstLoad, loading, status])

  return (
    <>
      {!pendingStatus ? (<>
        <Legend as="h2"><Link href={contractLink}>Multisig Contract</Link></Legend>
        {loading ? <SkeletonLoader /> : <div>{account && signers.includes(validateAndParseAddress(account)) ? "You are a signer of this multisig contract." : "You cannot sign transactions in this multisig contract."}</div>}
        {loading ? <SkeletonLoader /> : <div>Required signers: {threshold + "/" + signers.length}</div>}

        {multisig?.transactions && multisig.transactions.filter(tx => !tx.executed).length > 0 && (
          <>
            <hr />
            <InnerContainer>
              <InnerContainerTitle>PENDING TRANSACTIONS</InnerContainerTitle>
              <MultisigTransactionList multisigContract={multisigContract} transactions={multisig?.transactions} threshold={threshold} />
            </InnerContainer>
          </>
        )}

        <hr />
        <InnerContainer>
        <InnerContainerTitle>NEW TRANSACTION</InnerContainerTitle>
          <Tabs.Root defaultValue="tab1" orientation="vertical">
            <StyledTabs aria-label="tabs example">
              <StyledTrigger value="tab1" left>ERC-20 Transfer</StyledTrigger>
              <StyledTrigger value="tab2" right>Custom Transaction</StyledTrigger>
            </StyledTabs>
            
            <Tabs.Content value="tab1">
              <Erc20Transaction multisigContract={multisigContract} />
            </Tabs.Content>
            <Tabs.Content value="tab2">
              <ArbitraryTransaction multisigContract={multisigContract} />
            </Tabs.Content>
          </Tabs.Root>
        </InnerContainer>
      </>
      ) : <>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
          <span>Deploying...</span>
          <Link href={transactionFound ? transactionLink : contractLink}>{transactionFound ? "See transaction on Voyager" : "See contract on Voyager"}</Link>
        </div>

        <DeploymentStatus status={status} />
      </>}
    </>
  );
}
