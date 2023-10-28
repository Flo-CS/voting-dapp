import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Stepper from "../components/Stepper";
import VotingContractContext from "../contexts/VotingContractContext";
import { handleContractOperationError } from "../utils/contractErrors";
import { getEventsArgs } from "../utils/contracts";
import ContractSelector from "./ContractSelector";
import Input from "../components/Input";
import IconButton from "../components/IconButton";
import { MdCheck } from "react-icons/md";

const votingSteps = [
  { name: "Register voters", skipTo: null },
  { name: "Proposals registration", skipTo: 3 },
  { name: "Proposals registration end", skipTo: null },
  { name: "Voting session", skipTo: 5 },
  { name: "Voting session end", skipTo: null },
  { name: "Votes result", skipTo: null },
];

export default function VotingInfos() {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [voteSubject, setVoteSubject] = useState("");
  const [isLoadingGoNextWorkflowStatus, setIsLoadingWorkflowStatus] =
    useState(false);

  const [
    isLoadingGoNextAndSkipWorkflowStatus,
    setIsLoadingGoNextAndSkipWorkflowStatus,
  ] = useState(false);
  const [isLoadingRestartVote, setIsLoadingRestartWorkflowStatus] =
    useState(false);

  const [numberOfAdditionalVotesAllowed, setNumberOfAdditionalVotesAllowed] =
    useState(0);

  const { contract, isOwner } = useContext(VotingContractContext);

  const activeStepSkipTo = votingSteps[activeStep].skipTo;

  const fetchWorkflowStatus = useCallback(async () => {
    if (!contract) return;

    try {
      const status = await contract.currentStatus();
      setActiveStep(Number(status));
    } catch (error) {
      handleContractOperationError(error);
    }
  }, [contract]);

  const fetchVoteSubject = useCallback(async () => {
    if (!contract) return;

    try {
      const _voteSubject = await contract.voteSubject();
      setVoteSubject(_voteSubject);
    } catch (error) {
      handleContractOperationError(error);
    }
  }, [contract]);

  const fetchNumberOfAdditionalVotesAllowed = useCallback(async () => {
    if (!contract) return;

    try {
      const _numberOfAdditionalVotesAllowed =
        await contract.numberOfAdditionalVotesAllowed();

      setNumberOfAdditionalVotesAllowed(
        Number(_numberOfAdditionalVotesAllowed)
      );
    } catch (error) {
      handleContractOperationError(error);
    }
  }, [contract]);

  const sendGoNextWorkflowStatus = useCallback(async () => {
    if (!contract) return;

    setIsLoadingWorkflowStatus(true);
    try {
      const transaction = await contract.goNextWorkflowStatus();
      const receipt = await transaction.wait();
      const newStatus = Number(getEventsArgs(receipt)?.[1]);
      // OR: Listen to the event WorkflowStatusChange (but it works completely randomly)
      // OR: Fetch again the status
      // OR: make a static call/read-only call to the contract before sending the transaction
      setActiveStep(newStatus);
    } catch (error) {
      handleContractOperationError(error);
    }
    setIsLoadingWorkflowStatus(false);
  }, [contract]);

  const sendGoNextAndSkipWorkflowStatus = useCallback(async () => {
    if (!contract) return;

    setIsLoadingGoNextAndSkipWorkflowStatus(true);
    try {
      const transaction = await contract.goNextAndSkipEndWorkflowStatus();
      const receipt = await transaction.wait();
      const newStatus = Number(getEventsArgs(receipt)?.[1]);
      // OR: Listen to the event WorkflowStatusChange (but it works completely randomly)
      // OR: Fetch again the status
      // OR: make a static call/read-only call to the contract before sending the transaction
      setActiveStep(newStatus);
    } catch (error) {
      handleContractOperationError(error);
    }
    setIsLoadingGoNextAndSkipWorkflowStatus(false);
  }, [contract]);

  const sendRestartVote = useCallback(async () => {
    if (!contract) return;

    setIsLoadingRestartWorkflowStatus(true);
    try {
      const transaction = await contract.restart();
      await transaction.wait();
      fetchWorkflowStatus();
      fetchVoteSubject();
      fetchNumberOfAdditionalVotesAllowed();
    } catch (error) {
      handleContractOperationError(error);
    }
    setIsLoadingRestartWorkflowStatus(false);
  }, [
    contract,
    fetchWorkflowStatus,
    fetchVoteSubject,
    fetchNumberOfAdditionalVotesAllowed,
  ]);

  const sendVoteSubject = useCallback(async () => {
    if (!contract) return;

    try {
      const transaction = await contract.setVoteSubject(voteSubject);
      await transaction.wait();
      fetchVoteSubject();
    } catch (error) {
      handleContractOperationError(error);
    }
  }, [contract, voteSubject, fetchVoteSubject]);

  const onVoteSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoteSubject(e.target.value);
  };

  const sendSetNumberOfAdditionalVotesAllowed = useCallback(async () => {
    if (!contract) return;

    try {
      const transaction = await contract.setNumberOfAdditionalVotesAllowed(
        numberOfAdditionalVotesAllowed
      );
      await transaction.wait();
      fetchNumberOfAdditionalVotesAllowed();
    } catch (error) {
      handleContractOperationError(error);
    }
  }, [
    contract,
    numberOfAdditionalVotesAllowed,
    fetchNumberOfAdditionalVotesAllowed,
  ]);

  const onNumberOfAdditionalVotesAllowedChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (Number(e.target.value) < 0) return;
    setNumberOfAdditionalVotesAllowed(Number(e.target.value));
  };

  useEffect(() => {
    navigate(`${activeStep}`, { replace: true });
  }, [activeStep, navigate]);

  useEffect(() => {
    fetchWorkflowStatus();
    fetchVoteSubject();
    fetchNumberOfAdditionalVotesAllowed();
  }, [
    fetchWorkflowStatus,
    fetchVoteSubject,
    fetchNumberOfAdditionalVotesAllowed,
  ]);

  const showNextStepButton =
    isOwner === "yes" && activeStep < votingSteps.length - 1;
  const showNextAndSkipToButton =
    showNextStepButton && activeStepSkipTo !== null;
  const showRestartButton = isOwner === "yes" && activeStep === 5;

  const showSubjectText = voteSubject !== "";
  const showVoteConfigInputs = isOwner === "yes" && activeStep === 0;

  return (
    <div className="flex flex-col justify-center w-full">
      <div className="flex flex-col items-center">
        <ContractSelector />
      </div>
      <hr className="w-full my-16" />
      {showVoteConfigInputs && (
        <>
          <div className="flex items-center justify-center mb-4">
            <label htmlFor="voteSubject">Vote subject</label>
            <div className="w-full max-w-lg mx-2">
              <Input
                value={voteSubject}
                onChange={onVoteSubjectChange}
                placeholder="How can we improve our company ?"
                id="voteSubject"
              />
            </div>
            <IconButton onClick={sendVoteSubject} Icon={MdCheck} />
          </div>
          <div className="flex items-center justify-center mb-16">
            <label htmlFor="numberOfAdditionalVotesAllowed">
              Number of additional votes allowed
            </label>
            <div className="mx-2">
              <Input
                value={numberOfAdditionalVotesAllowed.toString()}
                onChange={onNumberOfAdditionalVotesAllowedChange}
                type="number"
                id="numberOfAdditionalVotesAllowed"
              />
            </div>
            <IconButton
              onClick={sendSetNumberOfAdditionalVotesAllowed}
              Icon={MdCheck}
            />
          </div>
        </>
      )}
      {showSubjectText && !showVoteConfigInputs && (
        <div className="flex items-center justify-center mb-16">
          <h3 className="text-xl font-semibold text-center">{voteSubject}</h3>
        </div>
      )}
      <div className="w-full max-w-4xl mx-auto mb-4">
        <Stepper>
          {votingSteps.map((step, idx) => {
            return (
              <Stepper.Item
                key={step.name}
                completed={idx <= activeStep}
                index={idx}
                isFirst={idx === 0}
              >
                {step.name}
              </Stepper.Item>
            );
          })}
        </Stepper>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-col space-y-2">
          {showNextStepButton && (
            <Button
              onClick={sendGoNextWorkflowStatus}
              isLoading={isLoadingGoNextWorkflowStatus}
              variant="primary"
            >
              Next step
            </Button>
          )}
          {showNextAndSkipToButton && (
            <Button
              onClick={sendGoNextAndSkipWorkflowStatus}
              isLoading={isLoadingGoNextAndSkipWorkflowStatus}
            >
              Skip directly to{" "}
              {votingSteps[activeStepSkipTo].name.toLowerCase()}
            </Button>
          )}
          {showRestartButton && (
            <Button onClick={sendRestartVote} isLoading={isLoadingRestartVote}>
              Restart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
