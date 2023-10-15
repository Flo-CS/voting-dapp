import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Web3Provider from "./providers/Web3Provider.tsx";
import VotingContractProvider from "./providers/VotingContractProvider.tsx";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import RegisterVoters from "./pages/RegisterVoters.tsx";
import ProposalsRegistration from "./pages/ProposalsRegistration.tsx";

const router = createBrowserRouter([
  {
    path: "/voting-dapp",
    element: <App />,
    errorElement: <div>404</div>,
    children: [
      {
        path: "0",
        element: <RegisterVoters />,
      },
      {
        path: "1",
        element: <ProposalsRegistration />,
      },
      {
        path: "2",
        element: <div>Step 2</div>,
      },
      {
        path: "3",
        element: <div>Step 3</div>,
      },
      {
        path: "4",
        element: <div>Step 4</div>,
      },
      {
        path: "5",
        element: <div>Step 5</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web3Provider>
      <VotingContractProvider>
        <RouterProvider router={router} />
      </VotingContractProvider>
    </Web3Provider>
  </React.StrictMode>
);
