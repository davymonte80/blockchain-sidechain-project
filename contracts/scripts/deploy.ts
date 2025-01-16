import { ethers } from "hardhat";
import { verify } from "./verify";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const initialSupply = ethers.utils.parseEther("1000000"); // 1 million tokens
  const Token = await ethers.getContractFactory("SideChainToken");
  const token = await Token.deploy("SideChain Token", "SCT", initialSupply);
  await token.deployed();

  console.log("Token deployed to:", token.address);

  // Verify the contract on Etherscan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contract...");
    await verify(token.address, ["SideChain Token", "SCT", initialSupply]);
  }

  // Save the contract address to a file
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/contracts";
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Token: token.address }, undefined, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
