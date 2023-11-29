<template>
  <span style="line-height: 0">
    <span
      v-if="type === 'rounded'"
      :style="iconStyle"
      class="material-symbols-rounded"
    >
      <slot name="default" />
      <template v-if="notHaveSlot">
        {{ name }}
      </template>
    </span>
    <span v-else :style="iconStyle" class="material-symbols-outlined">
      <slot name="default" />
      <template v-if="notHaveSlot">
        {{ name }}
      </template>
    </span>
  </span>
</template>

<script>
import { makeProp as p } from "@/util/props";
import { PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from "@/constants/props";
import { hasOwnProperty } from "@/util/object";

export default {
  name: "IconsGetter",
  props: {
    name: p(PROP_TYPE_STRING),
    type: p(PROP_TYPE_STRING, "rounded"),
    size: p(PROP_TYPE_NUMBER_STRING, "20"),
    sizeUnit: p(PROP_TYPE_NUMBER_STRING, "px"),
    color: p(PROP_TYPE_STRING),
  },
  computed: {
    notHaveSlot() {
      return !hasOwnProperty(this.$slots, "default");
    },
    iconStyle() {
      let style = "";
      if (this.color) {
        style = `color:${this.color}; font-size: ${this.size}${this.sizeUnit}`;
      } else {
        style = `font-size: ${this.size}${this.sizeUnit}`;
      }
      return style;
    },
  },
};
</script>
