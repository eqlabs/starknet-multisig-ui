import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { getChecksumAddress } from "starknet";
import { Field, Fieldset, Label } from "./Forms";
import { EmbeddedSubmitInput } from "./Input";

const MultisigAddressInput = () => {
  const router = useRouter();
  const [address, setAddress] = useState<string>("");
  
  const validateAddress = useCallback(() => {
    try {
      if (address.substring(0,2) !== "0x") {
        return false;
      }
      const checksumAddress = getChecksumAddress(address);
      return address.length === checksumAddress.length;
    } catch (e) {
      console.debug(e);
    }
    return false;
  }, [address])

  return (
    <Fieldset>
      <Field>
        <Label>Contract address:</Label>
        <EmbeddedSubmitInput
          type="text"
          value={address}
          placeholder="Insert a contract address"
          onChange={(e) => setAddress(e.target.value)}
          onClick={() => {
            if (validateAddress()) {
              router.push(`multisig/${address}`)
            }
          }}
          disabled={!validateAddress()}
        ></EmbeddedSubmitInput>
      </Field>
    </Fieldset>
  )
}

export default MultisigAddressInput
