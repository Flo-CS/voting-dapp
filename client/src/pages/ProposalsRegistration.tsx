import { ChangeEvent, useContext, useState } from "react";
import VotingContractContext from "../contexts/VotingContractContext";
import Input from "../components/Input";
import Button from "../components/Button";
import { handleContractOperationError } from "../utils/contractErrors";

export default function ProposalsRegistration() {
  const { contract } = useContext(VotingContractContext);

  const [proposalDescriptionInputValue, setProposalDescriptionInputValue] =
    useState("");
  const [isLoadingProposalRegistration, setIsLoadingProposalRegistration] =
    useState(false);

  const handleProposalDescriptionInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setProposalDescriptionInputValue(e.target.value);
  };

  const handleRegisterProposals = async () => {
    setIsLoadingProposalRegistration(true);
    try {
      const transaction = await contract?.registerProposal(
        proposalDescriptionInputValue
      );
      await transaction?.wait();
    } catch (err) {
      handleContractOperationError(err);
    }
    setIsLoadingProposalRegistration(false);
  };

  return (
    <div className="mt-12 flex flex-col space-y-8 items-center">
      <hr className="w-full" />
      <h3 className="text-3xl font-semibold">Proposals registration</h3>
      <div className="flex flex-col space-y-4 w-[28rem]">
        <Input
          placeholder="Proposal description"
          value={proposalDescriptionInputValue}
          onChange={handleProposalDescriptionInputChange}
        />
        <Button
          onClick={handleRegisterProposals}
          isLoading={isLoadingProposalRegistration}
        >
          Register proposal
        </Button>
      </div>
    </div>
  );
}
