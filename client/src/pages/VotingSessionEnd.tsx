import { useCallback, useContext, useEffect, useState } from "react";
import ProposalsContainer from "../components/ProposalsContainer";
import Web3Context from "../contexts/Web3Context";
import VotingContractContext from "../contexts/VotingContractContext";
import { Proposal as ProposalData } from "../types/Proposal";
import Proposal from "../components/Proposal";
import WarningMessage from "../components/WarningMessage";

export default function VotingSessionEnd() {
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
          votesCount: Number(proposal.voteCount),
        }))
      );
    };
    fetchProposals();
  }, [contract]);

  useEffect(() => {
    fetchVoterVote();
  }, [fetchVoterVote]);

  return (
    <div className="flex flex-col items-center mt-12 space-y-8">
      <hr className="w-full" />
      <h3 className="text-3xl font-semibold">Voting session end</h3>
      <WarningMessage message=" Voting session has ended. Wait for the owner to show the results." />
      <ProposalsContainer>
        {proposals.map((proposal) => {
          return (
            <Proposal
              key={proposal.id}
              description={proposal.description}
              id={proposal.id}
              votesCount={proposal.votesCount}
              showVotesCount={false}
              isVoted={votedProposalId === proposal.id}
            />
          );
        })}
      </ProposalsContainer>
    </div>
  );
}
