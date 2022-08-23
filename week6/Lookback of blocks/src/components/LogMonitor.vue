<template>
  <div class="w-4/5 h-screen flex items-center">
    <v-chart :option="option" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { use } from "echarts/core";

import { storeToRefs } from "pinia";

import { useMonitorStore } from "@/stores/monitor";
import alchemy from "@/utils/alchemy";
import { ethers } from "ethers";

// import ECharts modules manually to reduce bundle size
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
use([CanvasRenderer, LineChart, GridComponent]);

const monitorStore = useMonitorStore();
const { blockNums, totalVolumes, contractAddr } = storeToRefs(monitorStore);
blockNums.value = [];
totalVolumes.value = [];

const getBlockNum = async () => {
  const latestBlock = await alchemy.core.getBlockNumber();
  console.log("The latest block number is", latestBlock);

  for (let i = 9; i >= 0; i--) {
    blockNums.value.push(latestBlock - i);
  }

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
};
getBlockNum();

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

const option = ref({
  xAxis: {
    name: "Block Number",
    type: "category",
    data: blockNums,
  },
  yAxis: {
    name: "Total Transactions Volumes",
    type: "value",
    minInterval: 1,
  },
  animation: false,
  series: [
    {
      data: totalVolumes,
      type: "line",
    },
  ],
});
</script>
