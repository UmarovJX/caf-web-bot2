<script setup>
import TitleLarge from "@/components/reusable/title/TitleLarge.vue";
import { XIcon } from "@/components/elements/material-icons";
import { useAddressStore } from "@/store/address/address.store";
import { addressDetailsComposable } from "@/composable/address.composable";

const { openDrawerHandler } = useAddressStore();
const { addressInfo } = addressDetailsComposable();

function openAddressPicker() {
  openDrawerHandler();
}
</script>

<template>
  <div class="" style="cursor: pointer" @click="openAddressPicker">
    <div class="c-flex c-column-gap-05 c-align-center">
      <title-large>{{ addressInfo.type }}</title-large>
      <x-icon name="expand_more" size="28" style="padding-top: 0.25rem" />
    </div>
    <div class="c-delivery__value" v-if="addressInfo.detail !== ''">
      {{ addressInfo.detail }}
    </div>
  </div>
</template>

<style lang="scss">
.c-delivery__value {
  max-width: 162px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
