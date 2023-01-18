import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  CompiledContract, json
} from "starknet";
import { useSnapshot } from "valtio";
import Button from "~/components/Button";
import { Input, Select } from "~/components/Input";
import Paragraph from "~/components/Paragraph";
import { useContractDeployer } from "~/hooks/deploy";
import { state } from "~/state";
import { Field, Fieldset, Label, Legend } from "./Forms";
import InnerContainer from "./InnerContainer";

export function NewMultisig() {
  const router = useRouter();
  const { walletInfo } = useSnapshot(state);

  // Compile the multisig contract on mount
  const [compiledMultisig, setCompiledMultisig] = useState<CompiledContract>();
  useEffect(() => {
    const getCompiledMultisig = async (): Promise<CompiledContract> => {
      // Can't import the JSON directly due to a bug in StarkNet: https://github.com/0xs34n/starknet.js/issues/104
      // (even if the issue is closed, the underlying Starknet issue remains)
      const raw = await fetch("/Multisig.json");
      const compiled = json.parse(await raw.text());
      return compiled;
    };
    if (!compiledMultisig) {
      getCompiledMultisig().then(setCompiledMultisig);
    }
  }, [compiledMultisig]);

  // Input state
  const [signerThreshold, setSignerThreshold] = useState<number>(1);
  const [totalSigners, setTotalSigners] = useState<number>(1);
  const [signers, setSigners] = useState<string[]>([]);

  const [deploying, setDeploying] = useState<boolean>(false);

  const { deploy: deployMultisig } = useContractDeployer({
    compiledContract: compiledMultisig,
  });

  // Prefill the first field with currently logged in wallet address
  useEffect(() => {
    const emptySigners = [...Array(totalSigners).keys(), ""].map(() => "");
    emptySigners[0] = walletInfo && walletInfo.address || "";
    setSigners(emptySigners);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletInfo]);

  const onDeploy = async () => {
    const _deployMultisig = async () => {
      setDeploying(true);

      // Construct constructor inputs as BigNumbers
      const bnSigners = signers.slice(0, signers.length - 1);
      const calldata = [bnSigners, signerThreshold.toString()];

      // Call the contract factory with deployment instructions
      const deployment = await deployMultisig({
        constructorCalldata: calldata,
      });

      // Redirect the user to a pending deployment view upon deployment receipt
      if (deployment) {
        router.push(`/multisig/${deployment.address}`)
      } else {
        setDeploying(false);
      }
    };
    signers.length > 0 && await _deployMultisig();
  };

  const onThresholdChange = (value: string) => {
    setSignerThreshold(+value);
  };

  const onSignerChange = (value: string, index: number) => {
    // Put the new entry in copied version of signers[]
    let copy = [...signers];
    copy[index] = value;

    const allFieldsFilled = copy.every((signer) => signer !== "")
    let lastFilledIndex = 0
    signers.forEach((signer, i) => {
      if (signer !== "") {
        lastFilledIndex = i
      }
    })

    // Extend/trim signers[]
    if (allFieldsFilled && value !== "") {
      copy.push("")
    } else if (lastFilledIndex === index && value === "") {
      copy = copy.slice(0, lastFilledIndex + 1)
    }

    setTotalSigners(copy.length - 1);
    setSigners(copy);
  };

  return (
    <div>
      {!deploying ? 
      <Fieldset css={{gap: "0"}}>
        <Legend as="h2">Create a new multisig</Legend>
        <hr/>
        <Paragraph>
          Your contract will have one or more signers. We have prefilled the
          first signer with your connected wallet details, but you are free to
          change this to a different signer.
        </Paragraph>

        {/* Inputs */}
        <InnerContainer>
        {signers.map((signer, i) => (
          <Field key={i} inactive={signers.length > 1 && i === totalSigners.valueOf() && signer === ""}>
            <Label>Signer {i + 1} address:</Label>
            <Input
              type="text"
              autoComplete="off"
              onChange={(e) => onSignerChange(e.target.value, i)}
              value={signer}
            ></Input>
          </Field>
        ))}
        </InnerContainer>

        <Paragraph>
          Specify how many of them have to confirm a transaction before it
          gets executed. In general, the more confirmations required, the more
          secure your contract is.
        </Paragraph>

        <InnerContainer css={{flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: "$1", padding: "$2 $8"}}>
          <Paragraph
            css={{
              fontWeight: "500",
            }}
          >
            Transaction requires the confirmation of
          </Paragraph>
          <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <Select
              css={{
                margin: "0 $2 0 0",
                flexGrow: "0",
              }}
              onChange={(e) => {
                onThresholdChange(e.target.value);
              }}
              value={signerThreshold}
            >
              {[...Array(totalSigners).keys()].map((_, index) => {
                const thresholdOption = index + 1
                return <option value={thresholdOption.toString()} key={`thresholdOption-${thresholdOption.toString()}`}>{thresholdOption.toString()}</option>
              })}
            </Select>{" "}
            of {totalSigners} signers{" "}
          </div>
        </InnerContainer>

        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "1rem", marginTop: "1.5rem"}}>
          <Button outline onClick={router.back}>
            Go back
          </Button>
          <Button style={{flexGrow: "1"}} onClick={onDeploy}>
            Deploy multisig contract
          </Button>
        </div>
      </Fieldset>
      : <div>Deploying...</div>}
    </div>
  );
}
