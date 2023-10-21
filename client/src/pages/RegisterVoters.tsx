import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import VotingContractContext from "../contexts/VotingContractContext";
import { handleContractOperationError } from "../utils/contractErrors";
import WarningMessage from "../components/WarningMessage";
import { Voter } from "../types/Voter";
import Voters from "../components/VotersContainer";

export default function RegisterVoters() {
  const { contract, isOwner } = useContext(VotingContractContext);

  const [voterAddressInputValue, setVoterAddressInputValue] = useState("");
  const [isLoadingVoterRegistration, setIsLoadingVoterRegistration] =
    useState(false);
  const [voters, setVoters] = useState<Voter[]>([]);

  const fetchVoters = useCallback(async () => {
    try {
      const _voters = (await contract?.getVoters())?.map<Voter>((voter) => ({
        hasVoted: voter.hasVoted,
        isRegistered: voter.isRegistered,
        votedProposalId: Number(voter.votedProposalId),
        address: voter.addr,
      }));

      setVoters(_voters ?? []);
    } catch (err) {
      handleContractOperationError(err);
    }
  }, [contract]);

  const handleVoterAddressInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVoterAddressInputValue(e.target.value);
  };

  const handleRegisterVoter = async () => {
    setIsLoadingVoterRegistration(true);
    try {
      const transaction = await contract?.registerVoter(voterAddressInputValue);
      await transaction?.wait();
      setVoterAddressInputValue("");
      await fetchVoters();
    } catch (err) {
      handleContractOperationError(err);
    }
    setIsLoadingVoterRegistration(false);
  };

  const handleUnregisterVoter = async (voter: Voter) => {
    try {
      const transaction = await contract?.unregisterVoter(voter.address);
      await transaction?.wait();
      await fetchVoters();
    } catch (err) {
      handleContractOperationError(err);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, [fetchVoters]);

  return (
    <div className="flex flex-col items-center mt-12 space-y-8">
      <hr className="w-full" />
      <h3 className="text-3xl font-semibold">Register voters</h3>

      {(isOwner === "no" || isOwner === "unknown") && (
        <WarningMessage message="You are registered, just wait for the next step..." />
      )}

      {isOwner === "yes" && (
        <div className="flex flex-col space-y-4 w-full md:w-[28rem]">
          <Input
            placeholder="Voter address"
            value={voterAddressInputValue}
            onChange={handleVoterAddressInputChange}
          />
          <Button
            onClick={handleRegisterVoter}
            isLoading={isLoadingVoterRegistration}
            variant="primary"
          >
            Register voter
          </Button>
        </div>
      )}

      <Voters
        voters={voters}
        showActionButton={isOwner === "yes"}
        onUnregisterVoter={handleUnregisterVoter}
      />
    </div>
  );
}
