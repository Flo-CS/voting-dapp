import {
  BaseContract,
  BrowserProvider,
  ContractFactory,
  Signer,
  ethers,
} from "ethers";
import { useCallback, useEffect, useState } from "react";
import votingArtifact from "../../smart_contract/artifacts/contracts/Voting.sol/Voting.json";
import "./App.css";
import Header from "./components/Header";

function App() {
  const [provider, setProvider] = useState<BrowserProvider | undefined>();
  const [signer, setSigner] = useState<Signer | undefined>();
  const [, setVotingContract] = useState<BaseContract | undefined>(undefined);

  const updateSigner = useCallback(async () => {
    provider
      ?.getSigner()
      .then((signer) => {
        setSigner(signer);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [provider]);

  const updateProvider = () => {
    if (window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    } else {
      console.error("Please install Metamask");
    }
  };

  useEffect(() => {
    updateProvider();
  }, []);

  useEffect(() => {
    updateSigner();
  }, [updateSigner]);

  const deployVoteContract = async () => {
    const votingContractFactory = new ContractFactory(
      votingArtifact.abi,
      votingArtifact.bytecode,
      signer
    );

    const voting = await votingContractFactory.deploy();

    await voting.waitForDeployment();

    setVotingContract(voting);
  };

  return (
    <div className="app">
      <Header>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={updateSigner}
        >
          Connect to Metamask
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={deployVoteContract}
        >
          Start vote
        </button>
      </Header>
    </div>
  );
}

export default App;
