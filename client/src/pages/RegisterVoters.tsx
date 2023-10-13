import { useContext, useState, ChangeEvent, useEffect } from "react";
import Input from "../components/Input";
import VotingContractContext from "../contexts/VotingContractContext";
import { handleContractOperationError } from "../utils/contractErrors";

export default function RegisterVoters() {
  const { contract, isOwner } = useContext(VotingContractContext);

  const [voterAddressInputValue, setVoterAddressInputValue] = useState("");

  const handleVoterAddressInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVoterAddressInputValue(e.target.value);
  };

  const handleRegisterVoter = async () => {
    try {
      const transaction = await contract?.registerVoter(voterAddressInputValue);
      await transaction?.wait();
    } catch (err) {
      handleContractOperationError(err);
    }
  };

  useEffect(() => {
    const handleEvent = (voterAddress: string) => {
      console.log("Voter registered", voterAddress);
    };

    const addEventListener = async () => {
      await contract?.on(contract.getEvent("VoterRegistered"), handleEvent);
    };

    const removeEventListener = async () => {
      await contract?.off(contract.getEvent("VoterRegistered"), handleEvent);
    };

    addEventListener();

    return () => {
      removeEventListener();
    };
  }, [contract]);

  return (
    <div className="mt-12 flex flex-col space-y-8 items-center">
      <hr className="w-full" />
      <h3 className="text-3xl font-semibold">Register voter</h3>
      {/* List all voters */}

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
          <button
            className="bg-blue-500 px-4 py-2 rounded text-white font-semibold hover:bg-blue-600 "
            onClick={handleRegisterVoter}
          >
            Register voter
          </button>
        </div>
      )}
    </div>
  );
}
