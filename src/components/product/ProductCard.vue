<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div>
    <div class="card">
      <router-link :to="{ name: 'product-view' }" class="card-img">
        <img :src="props.product.image" alt="" />
        <p class="card-description t-small">{{ props.product.description }}</p>
        <span class="card-price b-small">{{ props.product.price }}</span>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  &-img {
    height: 136px;
    border-radius: 1rem;

    & img {
      height: 100%;
      object-fit: contain;
    }
  }

  &-description {
    color: var(--content_1);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0.5rem 0 0.25rem;
  }

  &-price {
    color: var(--content_3);
  }
}
</style>
