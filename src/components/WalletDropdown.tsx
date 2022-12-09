import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useConnectors } from "@starknet-react/core";
import { styled } from '@stitches/react';
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useSnapshot } from 'valtio';
import { state } from "~/state";
import { mapWalletIdToIcon, truncateAddress } from '~/utils';
import Button from "./Button";
import { Caret } from './Icons';

const Trigger = styled(DropdownMenu.Trigger, {
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  borderRadius: "35px",
  border: "0",
  whiteSpace: "nowrap",
  padding: "$2 $4",
  background: "rgba(255, 255, 255, 0.08)",
  color: "rgba(255, 255, 255, 0.51)",
  cursor: "pointer",
  gap: "$2",
  ".caret": {
    transition: "transform 0.1s ease",
  },
  '&[data-state="open"]': {
    ".caret": {
      transform: "scaleY(-1)",
    }
  }
})

const Content = styled(DropdownMenu.Content, {
  background: "$background",
  marginTop: "$1",
  borderRadius: "2rem",
  padding: "$4",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  textAlign: "right"
})

const WalletDropdown = () => {
  const router = useRouter();
  const { disconnect } = useConnectors();
  const { transactions, walletInfo } = useSnapshot(state);
  
  const disconnectCallback = useCallback(() => {
    disconnect();
    state.walletInfo = false;
    router.push("/");
  }, [disconnect, router]);

  return (
    walletInfo && walletInfo.address ? (
      <DropdownMenu.Root>
        {/* TODO: Map the used wallet type to a corresponding wallet icon */}
        <Trigger>
          <div>{mapWalletIdToIcon(walletInfo && walletInfo.id ? walletInfo.id : "0")}</div>
          <span>{truncateAddress(walletInfo.address, 12)}</span>
          <Caret className="caret" css={{stroke: "#FFFFFF", strokeWidth: "2px" }} height="17"/>
        </Trigger>

        <DropdownMenu.Portal>
          <Content>
            <DropdownMenu.Item>
              <Button size="sm" variant="link" onClick={disconnectCallback}>
                Disconnect
              </Button>
            </DropdownMenu.Item>
            {/* TODO: List past and current transactions to the user */}
            {/* <DropdownMenu.Separator />
            <DropdownMenu.Item>{transactions.slice(transactions.length - 10, transactions.length - 1).map(tx => (
              <div key={tx.hash}>{truncateAddress(tx.hash) + " - " + tx.status}</div>
            ))}</DropdownMenu.Item> */}
          </Content>
        </DropdownMenu.Portal>
        
      </DropdownMenu.Root>
    ) : <></>
  )
}
export default WalletDropdown;
