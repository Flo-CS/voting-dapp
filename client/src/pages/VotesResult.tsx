import { useCallback, useContext, useEffect, useState } from "react";
import ProposalsContainer from "../components/ProposalsContainer";
import VotingContractContext from "../contexts/VotingContractContext";
import { Proposal as ProposalData } from "../types/Proposal";
import Proposal from "../components/Proposal";
import { Voter } from "../types/Voter";
import { handleContractOperationError } from "../utils/contractErrors";
import Voters from "../components/VotersContainer";

export default function VotesResult() {
  const { contract } = useContext(VotingContractContext);
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [winningProposal, setWinningProposal] = useState<ProposalData>();
  const [voters, setVoters] = useState<Voter[]>([]);

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

  const fetchVoters = useCallback(async () => {
    try {
      const _voters = (await contract?.getVoters())?.map<Voter>((voter) => ({
        hasVoted: voter.hasVoted,
        isRegistered: voter.isRegistered,
        votedProposalIds: voter.votedProposalIds.map((id) => Number(id)),
        address: voter.addr,
      }));

      setVoters(_voters ?? []);
    } catch (err) {
      handleContractOperationError(err);
    }
  }, [contract]);

  useEffect(() => {
    fetchVoters();
  }, [fetchVoters]);

  const shownProposals = proposals.filter(
    (proposal) => proposal.id !== winningProposal?.id
  );

  return (
    <div className="flex flex-col items-center mt-12 space-y-12">
      <hr className="w-full" />
      <h3 className="text-3xl font-semibold">Votes result</h3>
      {winningProposal && (
        <div className="flex flex-col items-center space-y-8">
          <p className="text-xl">This is the winning proposal !</p>
          <Proposal
            description={winningProposal.description}
            id={winningProposal.id}
            votesCount={winningProposal.votesCount}
            showVotesCount={true}
            isWinning={true}
          />
        </div>
      )}
      {shownProposals.length !== 0 && (
        <div className="flex flex-col items-center space-y-8">
          <p className="text-xl ">And the votes for all others proposals</p>
          <ProposalsContainer>
            {shownProposals.map((proposal) => {
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
      )}
      <Voters voters={voters} proposals={proposals} showActionButton={false} />
    </div>
  );
}
