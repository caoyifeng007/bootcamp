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

import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
use([CanvasRenderer, LineChart, GridComponent]);

const monitorStore = useMonitorStore();
const { blockNumArr, ratioArr } = storeToRefs(monitorStore);

const option = ref({
  xAxis: {
    name: "Block Number",
    type: "category",
    data: blockNumArr,
  },
  yAxis: {
    name: "Ratio",
    type: "value",
  },
  animation: false,
  series: [
    {
      data: ratioArr,
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
