import { useContract } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Abi, Contract, validateAndParseAddress } from "starknet";
import { getSelectorFromName } from "starknet/dist/utils/hash";
import { bnToUint256 } from "starknet/dist/utils/uint256";
import { toBN } from "starknet/utils/number";
import { addMultisigTransaction } from "~/state/utils";
import { MultisigTransaction } from "~/types";
import { fetchTokenInfo, parseAmount, parseMultisigTransaction } from "~/utils";
import Source from "../../public/erc20.json";
import Button from "./Button";
import { Field, Fieldset, Label } from "./Forms";
import { Input, ValidatedInput } from "./Input";
import { LoaderWithDelay } from "./SkeletonLoader";

const Erc20Transaction = ({multisigContract}: {multisigContract?: Contract}) => {
  const targetFunctionSelector = getSelectorFromName("transfer");
  const [targetAddress, setTargetAddress] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  
  const submit = async () => {
    if (multisigContract) {
      const parsedAmount = parseAmount(amount, tokenInfo?.decimals || 18)
      const amountUint256 = bnToUint256(parsedAmount)
      const callData = [toBN(recipient), amountUint256.low, amountUint256.high];

      const { res: nonce } = await multisigContract?.get_transactions_len();
      const response = await multisigContract?.submit_transaction(targetAddress, targetFunctionSelector, callData, nonce);

      const parsedTransaction: MultisigTransaction = parseMultisigTransaction({
        nonce,
        targetAddress,
        targetFunctionSelector,
        callData,
        executed: false,
        threshold: 0,
      });

      addMultisigTransaction(multisigContract.address, parsedTransaction, { hash: response.transaction_hash, status: response.code });
    }
  };
  
  const { contract: targetContract } = useContract({
    abi: Source.abi as Abi,
    address: targetAddress,
  });

  const [tokenInfo, setTokenInfo] = useState<{symbol: string | undefined, balance: string | undefined, decimals: number | undefined} | undefined | null>();
  useEffect(() => {
    const getTokenInfo = async () => {
      if (multisigContract) {
        setTokenInfo(null);
        const tokenInfo = await fetchTokenInfo(targetAddress, multisigContract.address)
        setTokenInfo(tokenInfo)
      }
    }
    multisigContract && getTokenInfo()
  }, [multisigContract, multisigContract?.address, targetAddress, targetContract])

  return (
    <Fieldset>
      {/* TODO: Use a combobox for this field to give suggestions of deployed tokens */}
      <Field>
        <Label>Target contract address:</Label>
        <ValidatedInput
          type="text"
          value={targetAddress}
          validationFunction={(e) => {
            try {
              // TODO: This "validation" accepts things like 0 or "asd" as addresses, as they can be parsed and padded to the 64 bit addresses. Only accept already parsed addresses from the users.
              const result = validateAndParseAddress(e.target.value)
              return result ? true : false
            } catch (_e) {
              return false
            }
          }}
          onChange={(e) => setTargetAddress(e.target.value)}
        ></ValidatedInput>
      </Field>

      {tokenInfo !== undefined && tokenInfo === null ? <div>
        <LoaderWithDelay />
        <LoaderWithDelay />
        <LoaderWithDelay />
      </div> : tokenInfo?.symbol &&
        <div>
          Symbol: {tokenInfo.symbol}<br/>
          Decimals: {tokenInfo.decimals}<br/>
          Balance: {tokenInfo.balance}
        </div>
      }
      
      <Field>
        <Label>Receiver:</Label>
        <ValidatedInput
          type="text"
          value={recipient}
          validationFunction={(e) => {
            try {
              // TODO: This "validation" accepts things like 0 or "asd" as addresses, as they can be parsed and padded to the 64 bit addresses. Only accept already parsed addresses from the users.
              const result = validateAndParseAddress(e.target.value)
              return !!result
            } catch (_e) {
              return false
            }
          }}
          onChange={(e) => setRecipient(e.target.value)}
        ></ValidatedInput>
      </Field>

      <Field>
        <Label>Amount:</Label>
        <Input
          type="number"
          value={amount}
          min={0}
          step={0.01}
          onChange={(e) => setAmount(e.target.value)}
        ></Input>
      </Field>

      <Button fullWidth onClick={() => submit()}>Submit a new transaction</Button>
    </Fieldset>
  )
}

export default Erc20Transaction
