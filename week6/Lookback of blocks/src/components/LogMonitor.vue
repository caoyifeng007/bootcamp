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

// import ECharts modules manually to reduce bundle size
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
use([CanvasRenderer, LineChart, GridComponent]);

const monitorStore = useMonitorStore();
const { blockNumArr, totalVolumeArr } = storeToRefs(monitorStore);

const option = ref({
  xAxis: {
    name: "Block Number",
    type: "category",
    data: blockNumArr,
  },
  yAxis: {
    name: "Total Transactions Volumes",
    type: "value",
    minInterval: 1,
  },
  animation: false,
  series: [
    {
      data: totalVolumeArr,
      type: "line",
      symbolSize: 8,
      label: {
        show: true,
        position: "top",
      },
    },
  ],
});
</script>
