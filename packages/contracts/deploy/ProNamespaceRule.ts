import { Deployer } from "@matterlabs/hardhat-zksync";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { Wallet } from "zksync-ethers";

export default async function (hre: HardhatRuntimeEnvironment) {
  try {
    const wallet = new Wallet(process.env.PRIVATE_KEY as string);
    const deployer = new Deployer(hre, wallet as any);
    const artifact = await deployer.loadArtifact("ProNamespaceRule");
    const contract = await deployer.deploy(artifact);
    console.log(
      `${artifact.contractName} was deployed to ${await contract.getAddress()}`
    );
  } catch (error) {
    console.error("Error in deployment:", error);
    process.exit(1);
  }
}
