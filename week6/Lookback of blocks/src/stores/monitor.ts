import { ref } from "vue";
import { defineStore } from "pinia";

export const useMonitorStore = defineStore("monitor", () => {
  // Default ERC20 token is DAI
  const contractAddr = ref("0x6B175474E89094C44Da98b954EedeAC495271d0F");

  const blockNums = ref<number[]>([]);
  const totalVolumes = ref<number[]>([]);

  return { contractAddr, blockNums, totalVolumes };
});
