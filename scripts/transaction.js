// Import necessary modules from Hardhat and SwisstronikJS
const hre = require("hardhat");
const {
  encryptDataField,
  decryptNodeResponse,
} = require("@swisstronik/swisstronik.js");

const execution = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;

  const [encryptedData] = await encryptDataField(rpcLink, data);

  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {

  console.log("## Swisstronik-Code-Challenge-PERC20 ##\n");

  // contract address
  const address = "0x4620aeb05B14AE55FC6322826338A1DdE59a882b";
  const addressTransfer = "0x16af037878a6cAce2Ea29d39A3757aC2F6F7aac1";

  // init signer account
  const [signer] = await hre.ethers.getSigners();

  // init contract
  const factory = await hre.ethers.getContractFactory("SwisstronikPERC20");
  const contract = factory.attach(address); 

  // init function
  const mintFunction = "mint";
  const transferFunction = "transfer";

  console.log("[?] Mint Token to", address);
  const mintExecution = await execution(
    signer,
    address,
    contract.interface.encodeFunctionData(mintFunction),
    0
  );

  await mintExecution.wait();

  // It should return a TransactionReceipt object
  console.log("[+] Mint Hash:", mintExecution.hash);

  if(mintExecution.hash) {
    console.log("\n[?] Transfer 1 Token to", addressTransfer);
    const transferData = [
      addressTransfer,
      "1",
    ];
    const transferExecution = await execution(
      signer,
      address,
      contract.interface.encodeFunctionData(
        transferFunction,
        transferData
      ),
      0
    );
  
    await transferExecution.wait();
  
    // It should return a TransactionResponse object
    console.log("[+] Transfer Hash:", transferExecution.hash);
  }
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});