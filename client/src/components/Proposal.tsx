import classNames from "classnames";

type ProposalProps = {
  description: string;
  id: number;
  votesCount: number;
  showVotesCount?: boolean;
  onClick?: (id: number) => void;
  isVoted?: boolean;
};

export default function Proposal({
  description,
  id,
  votesCount,
  showVotesCount = true,
  onClick,
  isVoted,
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
      <div className="flex mx-4 my-2">
        <h4 className="text-lg">
          <span className="font-semibold">{id}</span>. {description}
        </h4>
      </div>
      {showVotesCount && (
        <div className="absolute top-0 right-0 flex items-center justify-center px-3 py-1 text-lg font-bold text-white bg-blue-500 border-2 border-white border-solid rounded-full translate-x-1/4 -translate-y-1/4">
          {votesCount}
        </div>
      )}
    </div>
  );
}
