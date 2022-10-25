import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useStarknet } from "@starknet-react/core";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { state } from "~/state";
import { truncateAddress } from '~/utils';
import Button from "./Button";

export function DisconnectWallet() {
  const router = useRouter();
  const { disconnect, account } = useStarknet();

  const disconnectCallback = useCallback(() => {
    disconnect();
    state.walletInfo = false;
    router.push("/");
  }, [disconnect, router]);

  return (
    account ? (
      <DropdownMenu.Root>
        {/* TODO: Map the used wallet type to a corresponding wallet icon */}
        <DropdownMenu.Trigger style={{display: "flex", flexDirection: "row", flexWrap: "nowrap", borderRadius: "35px", border: "0", whiteSpace: "nowrap", padding: "0.5rem 1rem", background: "rgba(255, 255, 255, 0.08)", color: "rgba(255, 255, 255, 0.51)", cursor: "pointer"}}><span>{truncateAddress(account, 12)}</span></DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content style={{background: "$background"}}>
            <DropdownMenu.Item>
              <Button size="sm" variant="link" onClick={disconnectCallback}>
                Disconnect
              </Button>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Transactions</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    ) : <></>
  )
}
