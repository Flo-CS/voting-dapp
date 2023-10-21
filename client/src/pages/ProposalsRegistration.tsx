import { ChangeEvent, useContext, useState } from "react";
import Button from "../components/Button";
import MultilineInput from "../components/MultilineInput";
import VotingContractContext from "../contexts/VotingContractContext";
import { handleContractOperationError } from "../utils/contractErrors";
import { separateMultiline } from "../utils/text";
import { ContractTransactionResponse } from "ethers";

export default function ProposalsRegistration() {
  const { contract } = useContext(VotingContractContext);

  const [proposalDescriptionInputValue, setProposalDescriptionInputValue] =
    useState("");
  const [isLoadingProposalRegistration, setIsLoadingProposalRegistration] =
    useState(false);

  const separatedProposalsDescriptionsInputValue = separateMultiline(
    proposalDescriptionInputValue,
    "---"
  );

  const handleProposalDescriptionInputChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setProposalDescriptionInputValue(e.target.value);
  };

  const handleRegisterProposals = async () => {
    setIsLoadingProposalRegistration(true);
    try {
      let transaction: ContractTransactionResponse | undefined;
      if (separatedProposalsDescriptionsInputValue.length === 1) {
        transaction = await contract?.registerProposal(
          separatedProposalsDescriptionsInputValue[0]
        );
      } else {
        transaction = await contract?.registerProposals(
          separatedProposalsDescriptionsInputValue
        );
      }
      await transaction?.wait();
      setProposalDescriptionInputValue("");
    } catch (err) {
      handleContractOperationError(err);
    }
    setIsLoadingProposalRegistration(false);
  };

  const buttonText =
    separatedProposalsDescriptionsInputValue.length > 1
      ? "Register proposals"
      : "Register proposal";

  return (
    <div className="flex flex-col items-center mt-12 space-y-8">
      <hr className="w-full" />
      <h3 className="text-3xl font-semibold">Proposals registration</h3>
      <div className="flex flex-col space-y-4 w-full md:w-[28rem]">
        <MultilineInput
          placeholder="Proposals descriptions (add --- between each proposal)"
          value={proposalDescriptionInputValue}
          onChange={handleProposalDescriptionInputChange}
        />
        <Button
          onClick={handleRegisterProposals}
          isLoading={isLoadingProposalRegistration}
          variant="primary"
          disabled={separatedProposalsDescriptionsInputValue.length === 0}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
