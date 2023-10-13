import { Contract, Signer } from "ethers";
import { ContractFactory } from "ethers/contract";

import votingArtifact from "../../../smart_contract/artifacts/contracts/Voting.sol/Voting.json";
import { Voting } from "../../../smart_contract/typechain-types";

export async function deployVotingContract(signer: Signer) {
  const votingContractFactory = new ContractFactory(
    votingArtifact.abi,
    votingArtifact.bytecode,
    signer
  );

  const voting = (await votingContractFactory.deploy()) as Voting;

  return await voting.waitForDeployment();
}

export function getVotingContract(address: string, signer: Signer) {
  return new Contract(address, votingArtifact.abi, signer) as Voting;
}
