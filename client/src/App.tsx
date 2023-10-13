import { useContext, useEffect, useState } from "react";
import "./App.css";
import Connection from "./components/Connection";
import Header from "./components/Header";
import Stepper from "./components/Stepper";
import ContractSelector from "./containers/ContractSelector";
import VotingContractContext from "./contexts/VotingContractContext";
import Web3Context from "./contexts/Web3Context";
import { middleTruncate } from "./utils/text";
import classnames from "classnames";
import { handleContractOperationError } from "./utils/contractErrors";
import ButtonSpinner from "./components/ButtonSpinner";

const votingSteps = [
  "Register voters",
  "Proposals registration",
  "Proposals registration end",
  "Voting session",
  "Voting session end",
  "Votes result",
];

function App() {
  const { provider, signer, signerAddress, connectSigner } =
    useContext(Web3Context);

  const { contract, isOwner } = useContext(VotingContractContext);

  const [activeStep, setActiveStep] = useState(0);

  const [isLoadingWorkflowStatus, setIsLoadingWorkflowStatus] = useState(true);

  const handleNextWorkflowStatusButtonClick = async () => {
    setIsLoadingWorkflowStatus(true);
    try {
      await contract?.goNextWorkflowStatus();
    } catch (err) {
      handleContractOperationError(err);
      setIsLoadingWorkflowStatus(false);
    }
  };

  useEffect(() => {
    const getWorkflowStatus = async () => {
      const status = await contract?.workflowStatus();
      setActiveStep(Number(status));
      setIsLoadingWorkflowStatus(false);
    };
    getWorkflowStatus();
  }, [contract]);

  useEffect(() => {
    const handleEvent = (_: bigint, newStatus: bigint) => {
      setActiveStep(Number(newStatus));
      setIsLoadingWorkflowStatus(false);
    };

    const addEventListener = async () => {
      await contract?.on(
        contract.getEvent("WorkflowStatusChange"),
        handleEvent
      );
    };

    const removeEventListener = async () => {
      await contract?.off(contract.getEvent("WorkflowStatusChange"));
    };

    addEventListener();
    return () => {
      removeEventListener();
    };
  }, [contract]);

  useEffect(() => {
    connectSigner();
  }, [connectSigner]);

  const truncatedSignerAddress =
    signerAddress && middleTruncate(signerAddress, 15);

  const showNextStepButton =
    isOwner === "yes" && activeStep < votingSteps.length - 1;

  return (
    <>
      <Header>
        {!provider ? (
          <p className="text-xl  text-red-500 font-bold">
            Please install Metamask
          </p>
        ) : (
          <Connection
            isConnected={!!signer}
            onConnect={connectSigner}
            connectionText={`Connected with ${truncatedSignerAddress}`}
            text="Connect to Metamask"
          />
        )}
      </Header>
      <div className="p-8">
        <div className="flex flex-col items-center space-y-8">
          <h2 className="text-3xl font-semibold">Contract selection</h2>
          <ContractSelector />
        </div>
        <div className="mt-16 flex flex-col justify-center items-center space-y-8">
          <hr className="w-full" />
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
    </>
  );
}

export default App;
