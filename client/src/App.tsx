import { useContext, useEffect } from "react";
import { Outlet } from "react-router";
import "./App.css";
import Connection from "./components/Connection";
import Header from "./components/Header";
import VotingInfos from "./containers/VotingWorkflow";
import Web3Context from "./contexts/Web3Context";
import { middleTruncate } from "./utils/text";
import { ToastContainer, Slide } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

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
          <p className="text-xl font-bold text-red-500">
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={3}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
        icon={true}
      />
    </>
  );
}

export default App;
