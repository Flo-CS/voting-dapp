import { ChangeEvent, useContext, useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import Input from "../components/Input";
import OwnerBadge from "../components/OwnerBadge";
import VotingContractContext from "../contexts/VotingContractContext";
import Button from "../components/Button";

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
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="flex flex-col items-end md:flex-row w-full gap-4 max-w-xl justify-center lg:items-center">
        <div className="w-full">
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
      <p className="text-lg font-semibold">OR</p>
      <Button onClick={deployNewVotingContract} variant="primary">
        Deploy new voting contract
      </Button>
    </div>
  );
}
