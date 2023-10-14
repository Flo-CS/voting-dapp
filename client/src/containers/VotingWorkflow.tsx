import classnames from "classnames";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ButtonSpinner from "../components/ButtonSpinner";
import Stepper from "../components/Stepper";
import VotingContractContext from "../contexts/VotingContractContext";
import { handleContractOperationError } from "../utils/contractErrors";
import ContractSelector from "./ContractSelector";
import { EventLog } from "ethers";
import useContractFunctionCall from "../hooks/useContractFunctionCall";
import { getEventsArgs } from "../utils/contracts";

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
    setIsLoadingWorkflowStatus(true);
    try {
      const status = await contract?.currentStatus();
      setActiveStep(Number(status));
    } catch (error) {
      handleContractOperationError(error);
    }
    setIsLoadingWorkflowStatus(false);
  }, [contract]);

  const sendGoNextWorkflowStatus = useCallback(async () => {
    setIsLoadingWorkflowStatus(true);
    try {
      const transaction = await contract?.goNextWorkflowStatus();
      const receipt = await transaction?.wait();
      const newStatus = Number(getEventsArgs(receipt)?.[1]);
      // OR: Listen to the event WorkflowStatusChange (but it works completely randomly)
      // OR: Fetch again the status
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
    if (!activeStep) return;
    navigate(`/voting-dapp/${activeStep}`);
  }, [activeStep, navigate]);

  useEffect(() => {
    fetchWorkflowStatus();
  }, [fetchWorkflowStatus]);

  const showNextStepButton =
    isOwner === "yes" && activeStep < votingSteps.length - 1;
  return (
    <div className="flex w-full justify-center space-x-24">
      <div className="flex flex-col items-center space-y-8">
        <h2 className="text-3xl font-semibold">Contract selection</h2>
        <ContractSelector />
      </div>
      <div className="flex flex-col justify-center items-center space-y-8">
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
          <button
            className={classnames(
              "bg-blue-500 text-white py-2 px-4 rounded font-semibold hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center space-x-2"
            )}
            disabled={isLoadingWorkflowStatus}
            onClick={sendGoNextWorkflowStatus}
          >
            {isLoadingWorkflowStatus && <ButtonSpinner />}
            Next step
          </button>
        )}
      </div>
    </div>
  );
}
