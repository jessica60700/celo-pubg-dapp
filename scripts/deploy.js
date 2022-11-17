const hre = require("hardhat");

async function main() {
  const Mypubg = await hre.ethers.getContractFactory("Mypubg");
  const mypubg = await Mypubg.deploy();

  await mypubg.deployed();

  console.log("Mypubg deployed to:", mypubg.address);
  storeContractData(mypubg);
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/Mypubg-address.json",
    JSON.stringify({ MypubgT: contract.address }, undefined, 2)
  );

  const MypubgArtifact = artifacts.readArtifactSync("Mypubg");

  fs.writeFileSync(
    contractsDir + "/Mypubg.json",
    JSON.stringify(MypubgArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });