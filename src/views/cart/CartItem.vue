<script setup>
import { computed, defineEmits, defineProps, ref } from "vue";
import api from "@/services/api";

//// swipe-code start
import { onClickOutside, usePointerSwipe } from "@vueuse/core";
import { formatToPrice } from "@/util/formatter";
import { XIcon } from "@/components/elements/material-icons";
import { TELEGRAM, WEB_APP } from "@/constants";

let webApp = window[TELEGRAM][WEB_APP];
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["updateList"]);

const target = ref(null);
const container = ref(null);
const containerWidth = computed(() => container.value?.offsetWidth);
const right = ref("0");

const reset = () => {
  right.value = "0";
};

onClickOutside(target, (event) => {
  if (event) {
    reset();
  }
});

const { distanceX, isSwiping } = usePointerSwipe(target, {
  onSwipe() {
    if (containerWidth.value) {
      if (distanceX.value > 0) {
        const distance = Math.abs(distanceX.value);
        right.value = `${distance}px`;
      } else {
        right.value = "0";
      }
    }
  },
  onSwipeEnd() {
    if (
      distanceX.value > 0 &&
      containerWidth.value &&
      Math.abs(distanceX.value) / containerWidth.value >= 0.2
    ) {
      right.value = "72px";
    } else {
      right.value = "0";
    }
  },
});

const deleteItem = async () => {
  await api.basket
    .removeProductFromBasket(props.item.id)
    .then(() => {
      emit("update-list");
    })
    .catch((e) => {
      return e;
    });
};

const currency = JSON.parse(localStorage.getItem("currency")) || {
  id: 1,
  name: "So'm",
  type: "UZS",
};

webApp.ready();
</script>

<template>
  <div ref="container" class="swipe-container">
    <div
      ref="target"
      :class="{ 'swipe-fade': !isSwiping }"
      :style="{ right }"
      class="cart-item d-flex align-items-center justify-content-between swipe-item"
    >
      <div class="d-flex align-items-center">
        <div class="cart-item_img">
          <img :src="props.item.product.image" alt="" />
          <span class="l-small">{{ props.item.count }}</span>
        </div>

        <div class="cart-item_info">
          <p class="t-medium">{{ props.item.name }}</p>
          <!--          <span class="b-medium">{{ props.item.description }}</span>-->
        </div>
      </div>

      <p class="cart-item_price b-large">
        {{ formatToPrice(props.item.price) }} {{ currency["name"] }}
      </p>
    </div>
    <div class="cart-delete">
      <div class="delete-button" @click="deleteItem()">
        <x-icon color="var(--red-base)" name="delete_sweep" size="24" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./cart-style.scss" />
