import { useCallback, useContext, useEffect, useState } from "react";
import VotingContractContext from "../contexts/VotingContractContext";
import Web3Context from "../contexts/Web3Context";
import ProposalsContainer from "../components/ProposalsContainer";
import { Proposal as ProposalData } from "../types/Proposal";
import Proposal from "../components/Proposal";
import { handleContractOperationError } from "../utils/contractErrors";

export default function VotingSession() {
  const { signerAddress } = useContext(Web3Context);
  const { contract } = useContext(VotingContractContext);

  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [votedProposalId, setVotedProposalId] = useState<number | null>(null);

  const fetchVoterVote = useCallback(async () => {
    if (!contract || !signerAddress) return;
    const hasVoted = (await contract.getVoter(signerAddress)).hasVoted;
    const voterVote = (await contract.getVoter(signerAddress)).votedProposalId;
    if (hasVoted) {
      setVotedProposalId(Number(voterVote));
    } else {
      setVotedProposalId(null);
    }
  }, [contract, signerAddress]);

  useEffect(() => {
    if (!contract) return;
    const fetchProposals = async () => {
      const _proposals = await contract.getProposals();

      setProposals(
        _proposals.map((proposal, idx) => ({
          description: proposal.description,
          id: idx,
          votesCount: Number(proposal.votesCount),
        }))
      );
    };
    fetchProposals();
  }, [contract]);

  useEffect(() => {
    fetchVoterVote();
  }, [fetchVoterVote]);

  async function handleProposalClick(id: number) {
    try {
      let transaction;
      if (votedProposalId === id) {
        transaction = await contract?.removeVote(votedProposalId);
      } else {
        transaction = await contract?.vote(id);
      }
      await transaction?.wait();
    } catch (err) {
      handleContractOperationError(err);
    }
    fetchVoterVote();
  }

  return (
    <div className="flex flex-col items-center mt-12 space-y-8">
      <hr className="w-full" />
      <h3 className="text-3xl font-semibold">Voting session</h3>
      <p className="text-lg">Select a proposal and vote for it</p>
      <ProposalsContainer>
        {proposals.map((proposal) => {
          return (
            <Proposal
              key={proposal.id}
              description={proposal.description}
              id={proposal.id}
              votesCount={proposal.votesCount}
              onClick={handleProposalClick}
              showVotesCount={false}
              isVoted={votedProposalId === proposal.id}
              showId={false}
            />
          );
        })}
      </ProposalsContainer>
    </div>
  );
}
