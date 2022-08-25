import { ref, type Ref } from "vue";
import { defineStore } from "pinia";

import { BigNumber, ethers } from "ethers";
import alchemy from "@/utils/alchemy";

export const useMonitorStore = defineStore("monitor", () => {
  // Default ERC20 token is DAI
  const contractAddr = ref("0x6B175474E89094C44Da98b954EedeAC495271d0F");

  const blockNumArr = ref<number[]>([]);
  const totalVolumeArr = ref<number[]>([]);
  const baseFeeArr = ref<string[]>([]);
  const ratioArr = ref<string[]>([]);

  async function init() {
    // Step0. Empty arrays
    blockNumArr.value = [];
    totalVolumeArr.value = [];
    baseFeeArr.value = [];

    // Step1. Calculate recent 10 blockNums
    const latestBlock = await alchemy.core.getBlockNumber();
    console.log("The latest block number is", latestBlock);

    for (let i = 9; i >= 0; i--) {
      blockNumArr.value.push(latestBlock - i);
    }

    // Step2. Calculate the volumes in chart1
    // solidity 文档关于topic的定义
    // https://docs.soliditylang.org/en/latest/abi-spec.html#events

    // alchemy 文档 eth_getLogs api 需要 topic
    // https://docs.alchemy.com/reference/eth-getlogs
    for (const bn of blockNumArr.value) {
      const res = await alchemy.core.getLogs({
        address: contractAddr.value,
        fromBlock: bn,
        toBlock: bn,
        topics: [ethers.utils.id("Transfer(address,address,uint256)")],
      });

      let sum = 0;
      res.forEach((item) => {
        sum += parseInt(item.data, 16);
      });
      totalVolumeArr.value.push(sum);
    }

    // Step3. Calculate the BASEFEE in chart2 and ratio in chart3
    for (const bn of blockNumArr.value) {
      const res = await alchemy.core.getBlock(bn);

      baseFeeArr.value.push(res.baseFeePerGas!.toString());

      ratioArr.value.push(
        ((res.gasUsed.toNumber() / res.gasLimit.toNumber()) * 100).toFixed(2)
      );
    }

    // Step4. Register subsccription on new block generate
    // Alchemy 文档 Emitted when a new block is mined.
    // https://docs.alchemy.com/reference/subscription-api#alchemy-sdks-event-types
    // Subscribe to new blocks, or newHeads
    alchemy.ws.on("block", async (latestBlockNumber) => {
      console.log("New block generate:", latestBlockNumber);
      blockNumArr.value.shift();
      blockNumArr.value.push(latestBlockNumber);

      const res = await alchemy.core.getLogs({
        address: contractAddr.value,
        fromBlock: latestBlockNumber,
        toBlock: latestBlockNumber,
        topics: [ethers.utils.id("Transfer(address,address,uint256)")],
      });

      totalVolumeArr.value.shift();
      let sum = 0;
      res.forEach((item) => {
        sum += parseInt(item.data, 16);
      });
      totalVolumeArr.value.push(sum);
    });
  }

  return {
    init,
    contractAddr,
    blockNumArr,
    totalVolumeArr,
    baseFeeArr,
    ratioArr,
  };
});
