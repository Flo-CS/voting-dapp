import { createContext } from "react";
import { Voting } from "./../typechain";

const VotingContractContext = createContext<{
  contractAddress?: string;
  contract?: Voting;
  isOwner: "yes" | "no" | "unknown";
  setContractAddress: (address: string) => void;
  deployNewVotingContract: () => Promise<void>;
}>({
  setContractAddress: () => {},
  deployNewVotingContract: async () => {},
  isOwner: "unknown",
});

export default VotingContractContext;
