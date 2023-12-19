<script setup>
import { computed, defineEmits, ref } from "vue";
import XIcon from "@/components/elements/material-icons/XIcon.vue";

const prop = defineProps({
  propsData: Object,
  multiLang: {
    type: Boolean,
    default: false,
  },
  isSubmitted: Boolean,
  isValidated: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const inputVal = computed({
  get() {
    return prop.propsData.value;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const labelActive = ref(false);

const toggleActive = (id) => {
  window.addEventListener("click", function (e) {
    labelActive.value = document.getElementById(id).contains(e.target);
  });
};
</script>
<template>
  <div
    :class="labelActive ? 'active' : '' || propsData['value'] ? 'active' : ''"
    class="app-input"
  >
    <label
      :class="
        propsData['value'] ? 'b-small' : '' || labelActive ? 'b-small' : ''
      "
      class="b-large"
    >
      <template v-if="multiLang">
        {{ $t(`${propsData["label"]}`) }}
      </template>
      <template v-else>
        {{ propsData["label"] }}
      </template>
    </label>

    <x-icon
      v-if="isSubmitted && !isValidated"
      class="error-icon"
      color="var(--red-base)"
      name="error"
      size="24"
    />

    <input
      :id="propsData['id']"
      v-model="inputVal"
      :class="{ 'is-not-valid': isSubmitted && !isValidated }"
      :type="propsData['type']"
      class="b-large"
      @click="toggleActive(propsData['id'])"
    />
  </div>
</template>

<style lang="scss" scoped src="./form-input.scss" />
