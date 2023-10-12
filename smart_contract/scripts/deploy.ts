import { ethers } from "hardhat";

async function main() {
  const Voting = await ethers.getContractFactory("Voting");

  const accounts = await ethers.getSigners();

  const voting = await Voting.deploy();

  await voting.waitForDeployment();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
