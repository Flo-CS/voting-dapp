import { ChangeEvent, useContext, useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import Input from "../components/Input";
import OwnerBadge from "../components/OwnerBadge";
import VotingContractContext from "../contexts/VotingContractContext";

export default function ContractSelector() {
  const {
    setContractAddress,
    isOwner,
    deployNewVotingContract,
    contractAddress,
  } = useContext(VotingContractContext);

  const [contractAddressInputValue, setContractAddressInputValue] =
    useState("");

  useEffect(() => {
    setContractAddressInputValue(contractAddress ?? "");
  }, [contractAddress]);

  const handleContractAddressInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setContractAddressInputValue(e.target.value);
  };

  const handleValidateContractAddress = () => {
    setContractAddress(contractAddressInputValue);
  };

  return (
    <div className="flex flex-col items-center space-y-2 w-full">
      <div className="flex justify-center w-full">
        <div className="mr-3 w-6/12">
          <Input
            placeholder="Enter deployed contract address"
            value={contractAddressInputValue}
            onChange={handleContractAddressInputChange}
            RightEl={
              <Input.RightIconButton
                onClick={handleValidateContractAddress}
                Icon={<MdSend />}
              />
            }
          />
        </div>
        <OwnerBadge isOwner={isOwner} />
      </div>
      <p className="font-semibold text-lg">OR</p>
      <button
        className="bg-blue-500 px-4 py-2 rounded text-white font-semibold"
        onClick={deployNewVotingContract}
      >
        Deploy new voting contract
      </button>
    </div>
  );
}
