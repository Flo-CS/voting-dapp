import { useContext, useEffect, useState } from "react";
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

  const [contractAddress, setContractAddress] = useState<string | undefined>(
    localStorage.getItem("contractAddress") ?? undefined
  );
  const { isOwner, contract } = useVotingContract(contractAddress, signer);

  const deployNewVotingContract = async () => {
    if (signer) {
      const contract = await deployVotingContract(signer);
      const contractAddress = await contract.getAddress();
      setContractAddress(contractAddress);
    }
  };

  useEffect(() => {
    if (contractAddress) {
      localStorage.setItem("contractAddress", contractAddress);
    }
  }, [contractAddress]);

  return (
    <VotingContractContext.Provider
      value={{
        contract,
        contractAddress,
        setContractAddress,
        deployNewVotingContract,
        isOwner,
      }}
    >
      {children}
    </VotingContractContext.Provider>
  );
}
