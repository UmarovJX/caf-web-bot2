<template>
  <span :style="iconStyle" class="material-symbols-rounded">
    <slot name="default" />
    <template v-if="notHaveSlot">
      {{ name }}
    </template>
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
    size: p(PROP_TYPE_NUMBER_STRING, "20"),
    sizeUnit: p(PROP_TYPE_NUMBER_STRING, "px"),
    color: p(PROP_TYPE_STRING),
  },
  computed: {
    notHaveSlot() {
      return !hasOwnProperty(this.$slots, "default");
    },
    iconStyle() {
      let style = `font-family: 'Material Symbols Rounded',serif;
          font-weight: normal;
          font-style: normal;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-feature-settings: 'liga';
          -webkit-font-smoothing: antialiased;
          `;
      if (this.color) {
        style += `color:${this.color}; fontSize: ${this.size}${this.sizeUnit}`;
      } else {
        style += `fontSize: ${this.size}${this.sizeUnit}`;
      }
      return style;
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-style {
  font-family: "Material Symbols Rounded", serif;
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
}
</style>
