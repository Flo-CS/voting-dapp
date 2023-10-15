import { useContext, useEffect, useState } from "react";
import ProposalsContainer from "../components/ProposalsContainer";
import VotingContractContext from "../contexts/VotingContractContext";
import { Proposal as ProposalData } from "../types/Proposal";
import Proposal from "../components/Proposal";

export default function VotesResult() {
  const { contract } = useContext(VotingContractContext);
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [winningProposal, setWinningProposal] = useState<ProposalData>();

  useEffect(() => {
    if (!contract) return;
    const fetchProposals = async () => {
      const _proposals = await contract.getProposals();
      const [_winningProposal, winningProposalId] =
        await contract.getWinningProposal();

      setProposals(
        _proposals.map((proposal, idx) => ({
          description: proposal.description,
          id: idx,
          votesCount: Number(proposal.votesCount),
        }))
      );

      setWinningProposal({
        description: _winningProposal.description,
        votesCount: Number(_winningProposal.votesCount),
        id: Number(winningProposalId),
      });
    };
    fetchProposals();
  }, [contract]);

  return (
    <div className="flex flex-col items-center mt-12 space-y-8">
      <hr className="w-full" />
      <h3 className="text-3xl font-semibold">Votes result</h3>
      <p className="text-xl">This is the winning proposal !</p>
      {winningProposal && (
        <Proposal
          description={winningProposal.description}
          id={winningProposal.id}
          votesCount={winningProposal.votesCount}
          showVotesCount={true}
          isWinning={true}
        />
      )}
      <p className="text-xl">There is votes for all others proposals</p>
      <ProposalsContainer>
        {proposals
          .filter((proposal) => proposal.id !== winningProposal?.id)
          .map((proposal) => {
            return (
              <Proposal
                key={proposal.id}
                description={proposal.description}
                id={proposal.id}
                votesCount={proposal.votesCount}
                isWinning={winningProposal?.id === proposal.id}
              />
            );
          })}
      </ProposalsContainer>
    </div>
  );
}
