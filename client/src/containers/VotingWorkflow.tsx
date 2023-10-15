import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Stepper from "../components/Stepper";
import VotingContractContext from "../contexts/VotingContractContext";
import { handleContractOperationError } from "../utils/contractErrors";
import { getEventsArgs } from "../utils/contracts";
import ContractSelector from "./ContractSelector";

const votingSteps = [
  "Register voters",
  "Proposals registration",
  "Proposals registration end",
  "Voting session",
  "Voting session end",
  "Votes result",
];

export default function VotingInfos() {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [isLoadingWorkflowStatus, setIsLoadingWorkflowStatus] = useState(false);

  const { contract, isOwner } = useContext(VotingContractContext);

  const fetchWorkflowStatus = useCallback(async () => {
    if (!contract) return;

    setIsLoadingWorkflowStatus(true);
    try {
      const status = await contract.currentStatus();
      setActiveStep(Number(status));
    } catch (error) {
      handleContractOperationError(error);
    }
    setIsLoadingWorkflowStatus(false);
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
      // OR: make a static/read-only call to the contract before sending the transaction
      setActiveStep(newStatus);
    } catch (error) {
      handleContractOperationError(error);
    }
    setIsLoadingWorkflowStatus(false);
  }, [contract]);

  /*useEffect(() => {
    const handleEvent = (_: bigint, status: bigint) => {
      console.log("WorkflowStatusChange", status.toString());
      setActiveStep(Number(status));
      navigate(`/voting-dapp/${status}`);
    };

    contract?.addListener("WorkflowStatusChange", handleEvent);
    console.log("addListener");

    return () => {
      console.log("removeListener");
      //contract?.removeListener("WorkflowStatusChange", handleEvent);
    };
  }, [contract, navigate]); */

  useEffect(() => {
    navigate(`${activeStep}`);
  }, [activeStep, navigate]);

  useEffect(() => {
    fetchWorkflowStatus();
  }, [fetchWorkflowStatus]);

  const showNextStepButton =
    isOwner === "yes" && activeStep < votingSteps.length - 1;
  return (
    <div className="flex justify-center w-full space-x-24">
      <div className="flex flex-col items-center space-y-8">
        <h2 className="text-3xl font-semibold">Contract selection</h2>
        <ContractSelector />
      </div>
      <div className="flex flex-col items-center justify-center space-y-8">
        <h2 className="text-3xl font-semibold">Voting</h2>
        <Stepper>
          {votingSteps.map((step, idx) => {
            return (
              <Stepper.Item
                key={step}
                completed={idx <= activeStep}
                index={idx}
                isLast={idx === votingSteps.length - 1}
              >
                {step}
              </Stepper.Item>
            );
          })}
        </Stepper>
        {showNextStepButton && (
          <Button
            onClick={sendGoNextWorkflowStatus}
            isLoading={isLoadingWorkflowStatus}
          >
            Next step
          </Button>
        )}
      </div>
    </div>
  );
}
