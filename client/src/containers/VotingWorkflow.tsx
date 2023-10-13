import classnames from "classnames";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ButtonSpinner from "../components/ButtonSpinner";
import Stepper from "../components/Stepper";
import VotingContractContext from "../contexts/VotingContractContext";
import { handleContractOperationError } from "../utils/contractErrors";
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

  const { contract, isOwner } = useContext(VotingContractContext);
  const [isLoadingWorkflowStatus, setIsLoadingWorkflowStatus] = useState(true);

  const handleNextWorkflowStatusButtonClick = async () => {
    setIsLoadingWorkflowStatus(true);
    try {
      const transaction = await contract?.goNextWorkflowStatus();
      await transaction?.wait();
    } catch (err) {
      handleContractOperationError(err);
      setIsLoadingWorkflowStatus(false);
    }
  };

  useEffect(() => {
    const getWorkflowStatus = async () => {
      if (!contract) return;

      const status = await contract.workflowStatus();

      setIsLoadingWorkflowStatus(false);
      setActiveStep(Number(status));

      navigate(`/voting-dapp/${status}`);
    };
    getWorkflowStatus();
  }, [contract, navigate]);

  useEffect(() => {
    const handleEvent = (_: bigint, newStatus: bigint) => {
      setIsLoadingWorkflowStatus(false);
      setActiveStep(Number(newStatus));

      navigate(`/voting-dapp/${newStatus}`);
    };

    const addEventListener = async () => {
      await contract?.on(
        contract.getEvent("WorkflowStatusChange"),
        handleEvent
      );
    };

    const removeEventListener = async () => {
      await contract?.off(
        contract.getEvent("WorkflowStatusChange"),
        handleEvent
      );
    };

    addEventListener();
    return () => {
      removeEventListener();
    };
  }, [contract, navigate]);

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
            onClick={handleNextWorkflowStatusButtonClick}
          >
            {isLoadingWorkflowStatus && <ButtonSpinner />}
            Next step
          </button>
        )}
      </div>
    </div>
  );
}
