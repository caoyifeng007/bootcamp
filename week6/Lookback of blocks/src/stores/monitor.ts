import { ref, type Ref } from "vue";
import { defineStore } from "pinia";

import { ethers } from "ethers";
import alchemy from "@/utils/alchemy";

export const useMonitorStore = defineStore("monitor", () => {
  // Default ERC20 token is DAI
  const contractAddr = ref("0x6B175474E89094C44Da98b954EedeAC495271d0F");

  const blockNums = ref<number[]>([]);
  const totalVolumes = ref<number[]>([]);

  async function init() {
    console.log(123123123123123);
    // Step0. Empty arrays
    blockNums.value = [];
    totalVolumes.value = [];

    // Step1. Calculate the blockNums
    const latestBlock = await alchemy.core.getBlockNumber();
    console.log("The latest block number is", latestBlock);

    for (let i = 9; i >= 0; i--) {
      blockNums.value.push(latestBlock - i);
    }

    // Step2. Calculate the volumes in chart1
    // solidity 文档关于topic的定义
    // https://docs.soliditylang.org/en/latest/abi-spec.html#events

    // alchemy 文档 eth_getLogs api 需要 topic
    // https://docs.alchemy.com/reference/eth-getlogs
    for (const blockNum of blockNums.value) {
      const res = await alchemy.core.getLogs({
        address: contractAddr.value,
        fromBlock: blockNum,
        toBlock: blockNum,
        topics: [ethers.utils.id("Transfer(address,address,uint256)")],
      });

      let sum = 0;
      res.forEach((item) => {
        sum += parseInt(item.data, 16);
      });
      totalVolumes.value.push(sum);
    }

    // Step3. Register subsccription on new block generate
    // Alchemy 文档 Emitted when a new block is mined.
    // https://docs.alchemy.com/reference/subscription-api#alchemy-sdks-event-types
    // Subscribe to new blocks, or newHeads
    alchemy.ws.on("block", async (latestBlockNumber) => {
      console.log("Latest block:", latestBlockNumber);
      blockNums.value.shift();
      blockNums.value.push(latestBlockNumber);

      const res = await alchemy.core.getLogs({
        address: contractAddr.value,
        fromBlock: latestBlockNumber,
        toBlock: latestBlockNumber,
        topics: [ethers.utils.id("Transfer(address,address,uint256)")],
      });

      totalVolumes.value.shift();
      let sum = 0;
      res.forEach((item) => {
        sum += parseInt(item.data, 16);
      });
      totalVolumes.value.push(sum);
    });
  }

  return { contractAddr, blockNums, totalVolumes, init };
});
