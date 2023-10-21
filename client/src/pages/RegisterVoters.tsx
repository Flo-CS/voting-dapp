import { ContractTransactionResponse } from "ethers";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Button from "../components/Button";
import MultilineInput from "../components/MultilineInput";
import Voters from "../components/VotersContainer";
import WarningMessage from "../components/WarningMessage";
import VotingContractContext from "../contexts/VotingContractContext";
import { Voter } from "../types/Voter";
import { handleContractOperationError } from "../utils/contractErrors";
import { separateMultiline } from "../utils/text";

export default function RegisterVoters() {
  const { contract, isOwner } = useContext(VotingContractContext);

  const [votersAddressesInputValue, setVoterAddressesInputValue] = useState("");
  const [isLoadingVoterRegistration, setIsLoadingVoterRegistration] =
    useState(false);
  const [voters, setVoters] = useState<Voter[]>([]);

  const separatedVotersAddressesInputValue = separateMultiline(
    votersAddressesInputValue
  );

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

  const handleVoterAddressInputChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setVoterAddressesInputValue(e.target.value);
  };

  const handleRegisterVoters = async () => {
    setIsLoadingVoterRegistration(true);
    try {
      let transaction: ContractTransactionResponse | undefined;
      if (separatedVotersAddressesInputValue.length === 1) {
        transaction = await contract?.registerVoter(votersAddressesInputValue);
      } else {
        transaction = await contract?.registerVoters(
          separatedVotersAddressesInputValue
        );
      }
      await transaction?.wait();

      setVoterAddressesInputValue("");
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
          <MultilineInput
            placeholder="Voters addresses (one per line)"
            value={votersAddressesInputValue}
            onChange={handleVoterAddressInputChange}
          />
          <Button
            onClick={handleRegisterVoters}
            isLoading={isLoadingVoterRegistration}
            variant="primary"
          >
            Register voters
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
