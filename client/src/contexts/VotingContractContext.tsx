import { createContext } from "react";
import { Voting } from "../../../smart_contract/typechain-types";
import { IsOwner } from "../types/Owner";

const VotingContractContext = createContext<{
  contractAddress?: string;
  contract?: Voting;
  isOwner: IsOwner;
  setContractAddress: (address: string) => void;
  deployNewVotingContract: () => Promise<void>;
}>({
  setContractAddress: () => {},
  deployNewVotingContract: async () => {},
  isOwner: "unknown",
});

export default VotingContractContext;
