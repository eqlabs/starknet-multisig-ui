import { useCallback, useState } from "react";
import {
  Abi,
  CompiledContract,
  Contract,
  ContractFactory,
  RawCalldata,
  getChecksumAddress,
  number,
  validateAndParseAddress,
} from "starknet";
import { useSnapshot } from "valtio";
import { state } from "~/state";
import { updateTransactionStatus } from "~/state/utils";
import { TransactionStatus } from "~/types";
import { classHash } from "~/utils/config";

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
  const [contract, setContract] = useState<Contract | undefined>();
  const { wallet } = useSnapshot(state);

  const deploy = useCallback(
    async ({ constructorCalldata }: DeployArgs) => {
      try {
        if (compiledContract && wallet) {
          const factory = new ContractFactory(
            compiledContract,
            classHash,
            wallet.account
          );
          const deployReceipt = await factory.deploy(constructorCalldata);
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
            wallet.provider
          );

          setContract(contract);
          return contract;
        }
      } catch (_e) {
        console.error(_e);
      }
      return undefined;
    },
    [compiledContract, wallet]
  );

  return { contract, deploy };
}
