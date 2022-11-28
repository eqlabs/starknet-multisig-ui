import { useStarknet } from "@starknet-react/core";
import { useCallback, useState } from "react";
import {
  Abi,
  CompiledContract,
  Contract,
  getChecksumAddress,
  number,
  RawCalldata,
  validateAndParseAddress,
} from "starknet";
import { state } from "~/state";
import { updateTransactionStatus } from "~/state/utils";
import { TransactionStatus } from "~/types";

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
  }: DeployArgs) => Promise<Contract | undefined>;
  contract?: Contract;
}

export function useContractDeployer({
  compiledContract,
}: UseContractDeployerArgs): UseContractDeployer {
  const { account, library } = useStarknet();
  const [contract, setContract] = useState<Contract | undefined>();

  const deploy = useCallback(
    async ({ constructorCalldata }: DeployArgs) => {
      try {
        if (
          compiledContract &&
          account &&
          compiledContract.program &&
          compiledContract.entry_points_by_type
        ) {
          const deployReceipt: any = await library.deployContract({
            contract: compiledContract,
            constructorCalldata: constructorCalldata,
          });

          const deployedAddress = getChecksumAddress(
            validateAndParseAddress(deployReceipt.address)
          );

          // Add the deployed multisig to state
          state.multisigs.push({
            address: deployedAddress,
            transactionHash: deployReceipt.transaction_hash,
            transactions: [],
          });

          updateTransactionStatus(
            deployReceipt.transaction_hash,
            TransactionStatus.NOT_RECEIVED
          );

          const contract = new Contract(
            compiledContract.abi,
            deployedAddress,
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
    [account, compiledContract, library]
  );

  return { contract, deploy };
}
