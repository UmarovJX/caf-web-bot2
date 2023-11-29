<script setup>
import { defineProps } from "vue";
import AppProduct from "@/components/AppProduct.vue";

const props = defineProps({
  // title: {
  //   type: String,
  //   default: "",
  // },
  products: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="favorites-section">
    <div class="custom-container">
      <!--      <h2 class="h-small">{{ props.title }}</h2>-->

      <div class="favorites-cards">
        <app-product
          v-for="item in props.products"
          :key="item.id"
          :description="item.name"
          :image="item.image"
          :price="item.price"
          :product="item['product']"
        >
        </app-product>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./favorites-section-style.scss" />
