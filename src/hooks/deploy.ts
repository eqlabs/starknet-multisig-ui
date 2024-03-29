import { useCallback } from "react";
import {
  Abi,
  CompiledContract,
  Contract,
  RawCalldata,
  number,
  stark,
} from "starknet";
import { useSnapshot } from "valtio";
import { state } from "~/state";
import { classHash, universalDeployerAddress } from "~/utils/config";
import universalDeployerAbi from "../../public/UniversalDeployer.json";

interface UseContractDeployerArgs {
  compiledContract?: CompiledContract;
  abi?: Abi;
}

interface DeployArgs {
  constructorCalldata: RawCalldata;
  addressSalt?: number.BigNumberish;
}

interface UseContractDeployer {
  deploy: ({
    constructorCalldata,
    addressSalt,
  }: DeployArgs) => Promise<string | undefined>;
  transaction?: string;
}

export function useContractDeployer({
  compiledContract,
}: UseContractDeployerArgs): UseContractDeployer {
  const { accountInterface } = useSnapshot(state);

  const deploy = useCallback(
    async ({ constructorCalldata }: DeployArgs) => {
      try {
        if (compiledContract && accountInterface) {
          const universalDeployer = new Contract(
            universalDeployerAbi,
            universalDeployerAddress,
            accountInterface
          );

          const salt = stark.randomAddress();

          const transaction = await universalDeployer.deployContract(
            classHash, // Class hash
            salt, // Salt
            1, // Unique address true/false
            constructorCalldata // Calldata
          );

          return transaction.transaction_hash;
        }
      } catch (_e) {
        console.error(_e);
      }
      return undefined;
    },
    [accountInterface, compiledContract]
  );

  return { deploy };
}
