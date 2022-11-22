import { useStarknet } from "@starknet-react/core";
import { useCallback, useState } from "react";
import {
  Abi,
  CompiledContract,
  Contract,
  DeployContractResponse,
  RawCalldata,
  validateAndParseAddress,
} from "starknet";
import { BigNumberish } from "starknet/dist/utils/number";
import { state } from "~/state";

interface UseContractDeployerArgs {
  compiledContract?: CompiledContract;
  abi?: Abi;
}

interface DeployArgs {
  constructorCalldata: RawCalldata;
  addressSalt?: BigNumberish;
}

interface UseContractDeployer {
  deploy: ({
    constructorCalldata,
    addressSalt,
  }: DeployArgs) => Promise<Contract | undefined>;
  contract?: Contract;
}

export function useContractDeployer({
  compiledContract,
}: UseContractDeployerArgs): UseContractDeployer {
  const { library } = useStarknet();
  const [contract, setContract] = useState<Contract | undefined>();

  const deploy = useCallback(
    async ({ constructorCalldata }: DeployArgs) => {
      try {
        if (compiledContract) {
          await library.declareContract({
            contract: compiledContract,
          });

          const deployReceipt: DeployContractResponse =
            await library.deployContract({
              contract: compiledContract,
              constructorCalldata: constructorCalldata,
            });

          // Add the deployed multisig to state
          state.multisigs.push({
            address: validateAndParseAddress(deployReceipt.contract_address),
            transactionHash: deployReceipt.transaction_hash,
            transactions: [],
          });

          const contract = new Contract(
            compiledContract.abi,
            validateAndParseAddress(deployReceipt.contract_address),
            library
          );

          setContract(contract);
          return contract;
        }
      } catch (_e) {
        console.error(_e);
      }
      return undefined;
    },
    [compiledContract, library]
  );

  return { contract, deploy };
}
