import classnames from "classnames";
import { Proposal } from "../types/Proposal";
import { Voter as VoterData } from "../types/Voter";

type VoterProps = {
  voter: VoterData;
  votes?: Proposal[];
  showVote?: boolean;
  LeftEl?: React.ReactNode;
};

export default function Voter({ voter, votes, showVote, LeftEl }: VoterProps) {
  return (
    <div className="flex flex-wrap items-center justify-center">
      <span
        className={classnames("mr-2", {
          "line-through": !voter.isRegistered,
        })}
      >
        {voter.address}
      </span>
      {showVote && (
        <span className="mr-2 text-center">
          {" "}
          has voted for proposals{" "}
          {votes?.map((vote, idx) => {
            console.log(vote.id);

            return (
              <>
                {idx > 0 && ", "}
                <span key={vote.id} className="font-semibold">
                  {vote.id}
                </span>
              </>
            );
          })}
        </span>
      )}
      {showVote && !votes && <span className="mr-2">hasn't voted</span>}
      {LeftEl && <span className="ml-auto">{LeftEl}</span>}
    </div>
  );
}
