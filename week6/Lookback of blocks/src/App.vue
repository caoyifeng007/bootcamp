<template>
  <div class="flex flex-col items-center p-10">
    <div class="flex w-1/3 justify-center space-x-8">
      <div class="flex flex-col w-full">
        <el-input
          class="h-10 w-full"
          v-model="inputAddr"
          placeholder="Input the ERC20 token you want to subscribe"
          name="address"
          @change="check"
          clearable
        />
        <span class="text-red-600">{{ errDisplay }}</span>

        <span class="h-10 w-full flex items-center">
          {{ contractAddr }}
        </span>
      </div>

      <el-button class="h-20" @click="renewSubscription" color="#626aef">
        Subscribe</el-button
      >
    </div>
  </div>

  <log-monitor />

  <base-fee-monitor />

  <ration-monitor />
</template>

<script setup lang="ts">
import { useMonitorStore } from "@/stores/monitor";

import { useForm } from "vee-validate";
// https://vee-validate.logaretm.com/v4/guide/best-practices#yup-bundle-size
// Yup bundle size
import { object, string } from "yup";

import LogMonitor from "@/components/LogMonitor.vue";
import BaseFeeMonitor from "@/components/BaseFeeMonitor.vue";
import RationMonitor from "@/components/RationMonitor.vue";

const monitorStore = useMonitorStore();
const { contractAddr } = storeToRefs(monitorStore);

const inputAddr = ref("");
const errDisplay = ref("");
const isValid = ref(false);

monitorStore.init();

interface Subscribe {
  address: string;
}
const schema = object({
  address: string()
    .required("Please input contract address")
    .min(42, "Please input contract address")
    .max(42)
    .matches(/(0x\w{40})/, {
      message: "Not a valid ERC20 token contract",
      excludeEmptyString: true,
    }),
});
// Create a form context with the validation schema
const { setValues, validate } = useForm<Subscribe>({
  validationSchema: schema,
});

async function check() {
  console.log("change event");
  setValues({
    address: inputAddr.value,
  });
  const res = await validate();
  errDisplay.value = res.errors.address!;
  isValid.value = res.valid;
  console.log(res.valid);
}

function renewSubscription() {
  if (!isValid.value) {
    return;
  }
  contractAddr.value = inputAddr.value;
  monitorStore.init();
  console.log("renew");
}
</script>
