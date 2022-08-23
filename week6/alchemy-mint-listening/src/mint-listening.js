// npm install @alchemy-sdk
import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
  network: Network.ETH_RINKEBY, // Replace with your network.
};

const alchemy = new Alchemy(settings);

// https://docs.ethers.io/v5/single-page/#/v5/api/utils/hashing/-%23-utils-id
// 这里可以使用  ethers.utils.id()
//  ethers.utils.id("Transfer(address,address,uint256)")
// 的输出就是 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
// 既 mintTopic 

// This is the "transfer event" topic we want to watch.
const mintTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
// This is the "from address" we want to watch.
const zeroTopic =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
// This is the NFT contract we want to watch.
const nftContractAddress = "0xbd34d145fcfd3992a0def1057891d51339a90128";

// Create the log options object.
const hackrDaoMintEvents = {
  address: nftContractAddress,
  topics: [mintTopic, zeroTopic],
};

// TODO: Add whatever logic you want to run upon mint events.
const doSomethingWithTxn = (txn) => console.log(txn);

console.log(`Listening on contract: ${nftContractAddress}`)

// Open the websocket and listen for events!
alchemy.ws.on(hackrDaoMintEvents, doSomethingWithTxn);


