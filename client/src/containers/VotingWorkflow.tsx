import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Stepper from "../components/Stepper";
import VotingContractContext from "../contexts/VotingContractContext";
import { handleContractOperationError } from "../utils/contractErrors";
import { getEventsArgs } from "../utils/contracts";
import ContractSelector from "./ContractSelector";

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
  const [isLoadingGoNextWorkflowStatus, setIsLoadingWorkflowStatus] =
    useState(false);

  const [
    isLoadingGoNextAndSkipWorkflowStatus,
    setIsLoadingGoNextAndSkipWorkflowStatus,
  ] = useState(false);

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

  useEffect(() => {
    navigate(`${activeStep}`, { replace: true });
  }, [activeStep, navigate]);

  useEffect(() => {
    fetchWorkflowStatus();
  }, [fetchWorkflowStatus]);

  const showNextStepButton =
    isOwner === "yes" && activeStep < votingSteps.length - 1;
  const showNextAndSkipToButton =
    showNextStepButton && activeStepSkipTo !== null;

  return (
    <div className="flex flex-col justify-center w-full">
      <div className="flex flex-col items-center">
        <ContractSelector />
      </div>
      <hr className="w-full my-16" />
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
        </div>
      </div>
    </div>
  );
}
