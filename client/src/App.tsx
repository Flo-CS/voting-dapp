import { useContext, useEffect } from "react";
import { Outlet } from "react-router";
import "./App.css";
import Connection from "./components/Connection";
import Header from "./components/Header";
import VotingInfos from "./containers/VotingWorkflow";
import Web3Context from "./contexts/Web3Context";
import { middleTruncate } from "./utils/text";

function App() {
  const { provider, signer, signerAddress, connectSigner } =
    useContext(Web3Context);

  useEffect(() => {
    connectSigner();
  }, [connectSigner]);

  const truncatedSignerAddress =
    signerAddress && middleTruncate(signerAddress, 15);

  return (
    <>
      <Header>
        {!provider ? (
          <p className="text-xl text-red-500 font-bold">
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
        <VotingInfos />
        <Outlet />
      </div>
    </>
  );
}

export default App;
