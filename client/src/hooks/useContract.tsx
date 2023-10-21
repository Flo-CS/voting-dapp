import { useState, useEffect, useCallback } from "react";
import { Voting } from "../../../smart_contract/typechain-types";

import { handleContractOperationError } from "../utils/contractErrors";
import { getVotingContract } from "../utils/votingContract";
import { Signer } from "ethers";
import { IsOwner } from "../types/Owner";

export default function useVotingContract(
  contractAddress?: string,
  signer?: Signer
) {
  const [contract, setContract] = useState<Voting>();
  const [isOwner, setIsOwner] = useState<IsOwner>("unknown");

  const testIsOwner = useCallback(async () => {
    if (!contract || !signer) return;

    try {
      const owner = await contract.owner();
      const signerAddress = await signer.getAddress();
      setIsOwner(owner === signerAddress ? "yes" : "no");
    } catch (error) {
      handleContractOperationError(error);
      setContract(undefined);
      setIsOwner("unknown");
    }
  }, [contract, signer]);

  const getContract = useCallback(async () => {
    if (!contractAddress || !signer) return;

    try {
      const contract = getVotingContract(contractAddress, signer);
      // Little basic test to know if the contract is deployed, if not, owner call will throw an error
      await contract.owner();
      setContract(contract);
    } catch (error) {
      setContract(undefined);
    }
  }, [contractAddress, signer]);

  useEffect(() => {
    getContract();
  }, [getContract]);

  useEffect(() => {
    testIsOwner();
  }, [testIsOwner]);

  return { contract, isOwner };
}
