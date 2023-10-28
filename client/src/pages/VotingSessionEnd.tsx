import { useCallback, useContext, useEffect, useState } from "react";
import ProposalsContainer from "../components/ProposalsContainer";
import Web3Context from "../contexts/Web3Context";
import VotingContractContext from "../contexts/VotingContractContext";
import { Proposal as ProposalData } from "../types/Proposal";
import Proposal from "../components/Proposal";
import WarningMessage from "../components/WarningMessage";
import { Voter as VoterData } from "../types/Voter";

export default function VotingSessionEnd() {
  const { signerAddress } = useContext(Web3Context);
  const { contract } = useContext(VotingContractContext);

  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [voter, setVoter] = useState<VoterData>();

  const fetchVoterVote = useCallback(async () => {
    if (!contract || !signerAddress) return;

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
              isVoted={voter?.votedProposalIds.includes(proposal.id)}
            />
          );
        })}
      </ProposalsContainer>
    </div>
  );
}
