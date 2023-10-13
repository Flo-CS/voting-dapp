import { useState, useEffect, useCallback } from "react";
import { Voting } from "../../../smart_contract/typechain-types";

import { handleContractOperationError } from "../utils/contractErrors";
import { getVotingContract } from "../utils/votingContract";
import { Signer } from "ethers";

export default function useVotingContract(
  contractAddress?: string,
  signer?: Signer
) {
  const [contract, setContract] = useState<Voting>();
  const [isOwner, setIsOwner] = useState<"yes" | "no" | "unknown">("unknown");

  const testIsOwner = useCallback(async () => {
    try {
      const owner = await contract?.owner();

      const signerAddress = await signer?.getAddress();
      setIsOwner(owner === signerAddress ? "yes" : "no");
    } catch (error) {
      handleContractOperationError(error);
      setContract(undefined);
      setIsOwner("unknown");
    }
  }, [contract, signer]);

  useEffect(() => {
    if (signer && contractAddress) {
      const contract = getVotingContract(contractAddress, signer);
      setContract(contract);
    }
  }, [signer, contractAddress]);

  useEffect(() => {
    if (contract) {
      testIsOwner();
    }
  }, [contract, testIsOwner]);

  return { contract, isOwner };
}
