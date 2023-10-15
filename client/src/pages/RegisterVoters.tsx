import { ChangeEvent, useContext, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import VotingContractContext from "../contexts/VotingContractContext";
import { handleContractOperationError } from "../utils/contractErrors";

export default function RegisterVoters() {
  const { contract, isOwner } = useContext(VotingContractContext);

  const [voterAddressInputValue, setVoterAddressInputValue] = useState("");
  const [isLoadingVoterRegistration, setIsLoadingVoterRegistration] =
    useState(false);

  const handleVoterAddressInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVoterAddressInputValue(e.target.value);
  };

  const handleRegisterVoter = async () => {
    setIsLoadingVoterRegistration(true);
    try {
      const transaction = await contract?.registerVoter(voterAddressInputValue);
      await transaction?.wait();
    } catch (err) {
      handleContractOperationError(err);
    }
    setIsLoadingVoterRegistration(false);
  };

  return (
    <div className="mt-12 flex flex-col space-y-8 items-center">
      <hr className="w-full" />
      <h3 className="text-3xl font-semibold">Register voter</h3>

      {["no", "unknown"].includes(isOwner) && (
        <p className="text-lg text-red-700 font-bold">
          You are not the owner of the contract, perhaps you will be registered
          for voting...
        </p>
      )}

      {isOwner === "yes" && (
        <div className="flex flex-col space-y-4 w-[28rem]">
          <Input
            placeholder="Voter address"
            value={voterAddressInputValue}
            onChange={handleVoterAddressInputChange}
          />
          <Button
            onClick={handleRegisterVoter}
            isLoading={isLoadingVoterRegistration}
          >
            Register voter
          </Button>
        </div>
      )}
    </div>
  );
}
