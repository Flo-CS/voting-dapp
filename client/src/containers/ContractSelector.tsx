import { ChangeEvent, useContext, useEffect } from "react";
import { MdSend } from "react-icons/md";
import Input from "../components/Input";
import OwnerBadge from "../components/OwnerBadge";
import useVotingContract from "../hooks/useContract";
import useUncontrolledInput from "../hooks/useUncontrolledInput";
import { deployVotingContract } from "../utils/votingContract";
import Web3Context from "../contexts/Web3Context";

export default function ContractSelector() {
  const { signer } = useContext(Web3Context);

  const {
    draftValue: contractAddressInputValue,
    setDraftValue: setContractAddressInputValue,
    validatedValue: contractAddress,
    setValidatedValue: setContractAddress,
  } = useUncontrolledInput(localStorage.getItem("contractAddress") ?? "");

  const { isOwner } = useVotingContract(contractAddress, signer);

  const handleDeployNewVotingContract = async () => {
    if (signer) {
      const contract = await deployVotingContract(signer);
      const contractAddress = await contract.getAddress();
      setContractAddress(contractAddress);
    }
  };

  const handleContractAddressInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setContractAddressInputValue(e.target.value);
  };

  const handleValidateContractAddress = () => {
    setContractAddress(contractAddressInputValue);
  };

  useEffect(() => {
    localStorage.setItem("contractAddress", contractAddress);
  }, [contractAddress]);

  return (
    <div className="flex flex-col items-center space-y-2">
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
        onClick={handleDeployNewVotingContract}
      >
        Deploy new voting contract
      </button>
    </div>
  );
}
