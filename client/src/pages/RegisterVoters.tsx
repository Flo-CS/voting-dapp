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
import Voters from "../components/Voters";

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

  useEffect(() => {
    fetchVoters();
  }, [fetchVoters]);

  const shownVoters = voters.map((voter) => ({
    address: voter.address,
  }));

  return (
    <div className="flex flex-col items-center mt-12 space-y-8">
      <hr className="w-full" />
      <h3 className="text-3xl font-semibold">Register voters</h3>

      {["no", "unknown"].includes(isOwner) && (
        <WarningMessage message="You are not the owner of the contract, perhaps you will be registered for voting.." />
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

      <Voters voters={shownVoters} />
    </div>
  );
}
