import classnames from "classnames";
import { Proposal } from "../types/Proposal";
import { Voter as VoterData } from "../types/Voter";
import { rightTruncate } from "../utils/text";

type VoterProps = {
  voter: VoterData;
  vote?: Proposal;
  showVote?: boolean;
  LeftEl?: React.ReactNode;
};

export default function Voter({ voter, vote, showVote, LeftEl }: VoterProps) {
  return (
    <div className="flex flex-wrap items-center justify">
      <span
        className={classnames("font-medium mr-2", {
          "line-through": !voter.isRegistered,
        })}
      >
        {voter.address}
      </span>
      {showVote && vote && (
        <span className="mr-2">
          {" "}
          has voted for{" "}
          <span className="font-medium">
            {rightTruncate(`${vote.id}. ${vote.description}`, 15)}
          </span>
        </span>
      )}
      {showVote && !vote && <span className="mr-2">hasn't voted</span>}
      {LeftEl && <span className="ml-auto">{LeftEl}</span>}
    </div>
  );
}
