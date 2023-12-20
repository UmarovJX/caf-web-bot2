<script setup>
const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="sidebar">
    <template v-for="(category, index) in props.categories" :key="index">
      <a
        v-if="category && category.products && category.products.length"
        class="sidebar-link l-large"
        :class="{ active: category.active }"
        :href="`#${category.id}`"
      >
        {{ category.name }}
      </a>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  overflow-x: scroll;
  background-color: #683724;
  display: flex;

  &-link {
    // writing-mode: vertical-rl;
    // text-orientation: mixed;
    // transform: rotate(180deg);
    padding: 1rem 0;
    color: var(--content_3);

    &.active {
      color: var(--content_1);
    }
  }
}
</style>
