import { Outlet } from "react-router";
import WarningMessage from "../components/WarningMessage";
import { useContext, useState, useCallback, useEffect } from "react";
import VotingContractContext from "../contexts/VotingContractContext";
import Web3Context from "../contexts/Web3Context";

export default function RegisteredRoute() {
  const { signerAddress } = useContext(Web3Context);
  const { contract, isOwner } = useContext(VotingContractContext);
  const [isRegistered, setIsRegistered] = useState<boolean | undefined>(false);

  const fetchRegisteredVoter = useCallback(async () => {
    const isRegistered = signerAddress
      ? (await contract?.getVoter(signerAddress))?.isRegistered
      : false;
    setIsRegistered(isRegistered);
  }, [contract, signerAddress]);

  useEffect(() => {
    fetchRegisteredVoter();
  }, [fetchRegisteredVoter]);

  if (!isRegistered && (isOwner === "no" || isOwner === "unknown")) {
    return (
      <div className="flex flex-col items-center mt-12 space-y-8">
        <hr className="w-full" />
        <WarningMessage message="You are not registered to vote. You can wait to see the results..." />
      </div>
    );
  }
  return (
    <>
      <Outlet />
    </>
  );
}
