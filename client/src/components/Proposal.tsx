import classNames from "classnames";
import { MdStar } from "react-icons/md";

type ProposalProps = {
  description: string;
  id: number;
  votesCount: number;
  showVotesCount?: boolean;
  onClick?: (id: number) => void;
  isVoted?: boolean;
  isWinning?: boolean;
  showId?: boolean;
};

export default function Proposal({
  description,
  id,
  votesCount,
  showVotesCount = true,
  onClick,
  isVoted,
  isWinning,
  showId = true,
}: ProposalProps) {
  function handleProposalClick() {
    if (onClick) onClick(id);
  }

  return (
    <div
      className={classNames("relative flex rounded-lg bg-slate-100 w-64", {
        "cursor-pointer": !!onClick,
        "border-green-500 border-solid border-2": isVoted,
      })}
      onClick={handleProposalClick}
    >
      <div className="flex w-full mx-4 my-2">
        <h4 className="w-full text-lg text-center">
          {showId && <span className="font-semibold">{id}.</span>} {description}
        </h4>
      </div>
      {showVotesCount && (
        <>
          <div className="absolute top-0 right-0 flex items-center justify-center px-3 py-1 text-lg font-bold text-white bg-green-500 border-2 border-white border-solid rounded-full translate-x-2/4 -translate-y-2/4">
            {votesCount}{" "}
            {isWinning && (
              <span className="ml-2 ">
                <MdStar className="w-6 h-6 text-yellow-300" />
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
