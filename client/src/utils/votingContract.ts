import { Signer } from "ethers";

import votingArtifact from "../../../smart_contract/artifacts/contracts/Voting.sol/Voting.json";

import { Voting__factory } from "../../../smart_contract/typechain-types";

export async function deployVotingContract(signer: Signer) {
  const votingContractFactory = new Voting__factory(
    votingArtifact.abi,
    votingArtifact.bytecode,
    signer
  );

  const voting = await votingContractFactory.deploy();

  return await voting.waitForDeployment();
}

export function getVotingContract(address: string, signer: Signer) {
  return Voting__factory.connect(address, signer);
}
