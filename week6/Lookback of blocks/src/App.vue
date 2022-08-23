<template>
  <div class="flex flex-col items-center p-10">
    <div class="flex w-1/3 justify-center space-x-8">
      <div class="flex flex-col w-full">
        <el-input class="h-10 w-full" v-model="inputAddr" clearable />

        <span class="h-10 w-full flex items-center">
          {{ contractAddr }}
        </span>
      </div>

      <el-button class="h-20" @click="contractAddr = inputAddr" color="#626aef">
        Subscribe</el-button
      >
    </div>
  </div>

  <el-button @click="getBlockNum">Get Block Number</el-button>

  <div class="w-4/5 h-screen flex items-center">
    <v-chart :option="option" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { use } from "echarts/core";

// import ECharts modules manually to reduce bundle size
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";

import alchemy from "@/utils/alchemy";

use([CanvasRenderer, LineChart, GridComponent]);

const contractAddr = ref("");
const inputAddr = ref("");

const blockNums = ref<number[]>([]);
const totalVolumes = ref<number[]>([]);

const option = ref({
  xAxis: {
    type: "category",
    data: blockNums,
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: totalVolumes,
      type: "line",
    },
  ],
});

const getBlockNum = async () => {
  const latestBlock = await alchemy.core.getBlockNumber();
  console.log("The latest block number is", latestBlock);

  for (let i = 9; i >= 0; i--) {
    blockNums.value.push(latestBlock - i);
  }
};
</script>
