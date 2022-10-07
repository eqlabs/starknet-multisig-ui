import { useRouter } from "next/router";
import { useState } from "react";
import { Field, Fieldset, Label } from "./Forms";
import { EmbeddedSubmitInput } from "./Input";

const MultisigAddressInput = () => {
  const router = useRouter();
  const [address, setAddress] = useState<string>("");
  return (
    <Fieldset>
      <Field>
        <Label>Contract address:</Label>
        <EmbeddedSubmitInput
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onClick={() => router.push(`wallet/${address}`)}
        ></EmbeddedSubmitInput>
      </Field>
    </Fieldset>
  )
}

export default MultisigAddressInput
