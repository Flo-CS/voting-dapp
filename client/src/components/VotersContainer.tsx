import { MdExitToApp } from "react-icons/md";
import IconButton from "./IconButton";
import Voter from "./Voter";
import { Proposal } from "../types/Proposal";
import { Voter as VoterData } from "../types/Voter";

type VotersProps = {
  voters: VoterData[];
  proposals?: Proposal[];
  showActionButton?: boolean;
  onUnregisterVoter?: (voter: VoterData) => void;
};

export default function Voters({
  voters,
  proposals,
  showActionButton = true,
  onUnregisterVoter,
}: VotersProps) {
  const getActionButton = (voter: VoterData) => {
    if (!showActionButton) return null;
    if (!voter.isRegistered) return null;

    return (
      <IconButton
        Icon={MdExitToApp}
        onClick={() => onUnregisterVoter?.(voter)}
      />
    );
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-3 text-2xl font-medium">Voters</h3>
      <ul>
        {voters.map((voter) => {
          const vote = proposals?.find(
            (proposal) =>
              voter.hasVoted && proposal.id === voter.votedProposalId
          );

          const showVote = proposals && vote && voter.isRegistered;

          return (
            <li key={voter.address} className="mb-2">
              <Voter
                voter={voter}
                vote={vote}
                showVote={showVote}
                LeftEl={getActionButton(voter)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
