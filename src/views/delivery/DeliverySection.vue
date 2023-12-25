<script setup>
import { defineProps, defineEmits } from "vue";
import AppProduct from "@/components/AppProduct.vue";
import { vIntersectionObserver } from "@vueuse/components";
const emit = defineEmits(["intersect"]);

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

function intersectionHandler(isIntersecting) {
  if (isIntersecting) emit("intersect");
}
</script>

<template>
  <div v-if="products.length" class="delivery-section">
    <div class="custom-container">
      <h2
        class="h-small"
        :id="category.id"
        v-intersection-observer="
          ([{ isIntersecting }]) => intersectionHandler(isIntersecting)
        "
      >
        {{ props.title }}
      </h2>

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
