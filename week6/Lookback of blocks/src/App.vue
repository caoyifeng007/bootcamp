<template>
  <div class="flex flex-col items-center p-10">
    <div class="flex w-1/3 justify-center space-x-8">
      <div class="flex flex-col w-full">
        <el-input class="h-10 w-full" v-model="inputAddr" clearable />

        <span class="h-10 w-full flex items-center">
          {{ contractAddr }}
        </span>
      </div>

      <el-button class="h-20" @click="renewSubscription" color="#626aef">
        Subscribe</el-button
      >
    </div>
  </div>

  <!-- <el-button @click="getBlockNum">Get Block Number</el-button> -->

  <log-monitor />

  <base-fee-monitor />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useMonitorStore } from "@/stores/monitor";

import LogMonitor from "@/components/LogMonitor.vue";
import BaseFeeMonitor from "@/components/BaseFeeMonitor.vue";

const monitorStore = useMonitorStore();
const { contractAddr } = storeToRefs(monitorStore);

const inputAddr = ref("");

monitorStore.init();

function renewSubscription() {
  contractAddr.value = inputAddr.value;
  monitorStore.init();
}
</script>
