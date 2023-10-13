import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Web3Provider from "./providers/Web3Provider.tsx";
import VotingContractProvider from "./providers/VotingContractProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web3Provider>
      <VotingContractProvider>
        <App />
      </VotingContractProvider>
    </Web3Provider>
  </React.StrictMode>
);
