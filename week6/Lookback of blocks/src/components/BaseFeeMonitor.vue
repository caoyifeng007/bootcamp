<template>
  <div class="w-4/5 h-screen flex items-center">
    <v-chart :option="option" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { use } from "echarts/core";

// import { storeToRefs } from "pinia";

// import { useMonitorStore } from "@/stores/monitor";
import alchemy from "@/utils/alchemy";
import { ethers } from "ethers";

import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
use([CanvasRenderer, LineChart, GridComponent]);

// const monitorStore = useMonitorStore();
// const { blockNums, totalVolumes, contractAddr } = storeToRefs(monitorStore);
// blockNums.value = [];
// totalVolumes.value = [];

// Alchemy 文档 Emitted when a new block is mined.
// https://docs.alchemy.com/reference/subscription-api#alchemy-sdks-event-types
// Subscribe to new blocks, or newHeads
alchemy.ws.on("block", async (latestBlockNumber) => {
  console.log("Latest block:", latestBlockNumber);

  const res = await alchemy.core.getLogs({
    address: contractAddr.value,
    fromBlock: latestBlockNumber,
    toBlock: latestBlockNumber,
    topics: [ethers.utils.id("Transfer(address,address,uint256)")],
  });
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
