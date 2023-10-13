import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import VotingContractContext from "../contexts/VotingContractContext";
import Web3Context from "../contexts/Web3Context";
import useVotingContract from "../hooks/useContract";
import { deployVotingContract } from "../utils/votingContract";

export default function VotingContractProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signer } = useContext(Web3Context);

  const [contractAddress, setContractAddress] = useState<string | undefined>();
  const { isOwner, contract } = useVotingContract(contractAddress, signer);

  const deployNewVotingContract = useCallback(async () => {
    if (signer) {
      const contract = await deployVotingContract(signer);
      const contractAddress = await contract.getAddress();
      setContractAddress(contractAddress);
    }
  }, [signer]);

  useEffect(() => {
    if (contractAddress) {
      localStorage.setItem("latestContractAddress", contractAddress);
    }
  }, [contractAddress]);

  const value = useMemo(
    () => ({
      contract,
      contractAddress,
      setContractAddress,
      deployNewVotingContract,
      isOwner,
    }),
    [
      contract,
      contractAddress,
      setContractAddress,
      deployNewVotingContract,
      isOwner,
    ]
  );

  return (
    <VotingContractContext.Provider value={value}>
      {children}
    </VotingContractContext.Provider>
  );
}
