import { useCallback, useContext, useEffect, useState } from "react";
import VotingContractContext from "../contexts/VotingContractContext";
import Web3Context from "../contexts/Web3Context";
import ProposalsContainer from "../components/ProposalsContainer";
import { Proposal as ProposalData } from "../types/Proposal";
import { Voter as VoterData } from "../types/Voter";
import Proposal from "../components/Proposal";
import { handleContractOperationError } from "../utils/contractErrors";

export default function VotingSession() {
  const { signerAddress } = useContext(Web3Context);
  const { contract } = useContext(VotingContractContext);

  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [voter, setVoter] = useState<VoterData | undefined>();
  const [numberOfAdditionalVotesAllowed, setNumberOfAdditionalVotesAllowed] =
    useState(0);

  const fetchVoterVote = useCallback(async () => {
    if (!contract || !signerAddress) return;
    const _numberOfAdditionalVotesAllowed =
      await contract.numberOfAdditionalVotesAllowed();
    setNumberOfAdditionalVotesAllowed(Number(_numberOfAdditionalVotesAllowed));

    const _voter = await contract.getVoter(signerAddress);
    if (_voter.hasVoted) {
      setVoter({
        hasVoted: _voter.hasVoted,
        isRegistered: _voter.isRegistered,
        address: _voter.addr,
        votedProposalIds: _voter.votedProposalIds.map((id) => Number(id)),
      });
    } else {
      setVoter(undefined);
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
      if (voter?.votedProposalIds.includes(id)) {
        transaction = await contract?.removeVote(id);
      } else {
        transaction = await contract?.vote(id);
      }
      await transaction?.wait();
    } catch (err) {
      handleContractOperationError(err);
    }
    fetchVoterVote();
  }

  const numberOfVotesDone = voter?.votedProposalIds.length ?? 0;
  const numberOfVotesAllowed = numberOfAdditionalVotesAllowed + 1;

  return (
    <div className="flex flex-col items-center mt-12 space-y-8">
      <hr className="w-full" />
      <h3 className="text-3xl font-semibold">Voting session</h3>
      <div>
        <p className="text-lg text-center">Select a proposal and vote for it</p>
        <p className="text-lg text-center">
          You have completed{" "}
          <span className="font-semibold">
            {numberOfVotesDone}/{numberOfVotesAllowed} votes
          </span>
        </p>
      </div>
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
              isVoted={voter?.votedProposalIds.includes(proposal.id)}
              showId={false}
            />
          );
        })}
      </ProposalsContainer>
    </div>
  );
}
