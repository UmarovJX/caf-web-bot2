<script setup>
import { defineProps } from "vue";
import AppProduct from "@/components/AppProduct.vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  products: {
    type: Array,
    default: () => [],
  },
  category: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div v-if="products.length" class="delivery-section">
    <div class="custom-container">
      <h2 class="h-small" :id="category.id">{{ props.title }}</h2>

      <div class="delivery-cards">
        <app-product
          v-for="product in props.products"
          :key="product.id"
          :description="product.name"
          :image="product.image"
          :price="product.product.price"
          :product="product"
        >
        </app-product>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./delivery-section-style.scss" />
