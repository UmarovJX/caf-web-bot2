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
    <div class="sticky-head">
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

    <!--    :class="{ active: item.active }"-->
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  width: calc(100% / 9);
  padding: 1.5rem 10px;
  border-radius: 0 40px 0 0;
  background-color: #683724;

  &-link {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    padding: 1rem 0;
    color: var(--content_3);

    &.active {
      color: var(--content_1);
    }
  }
}

.sticky-head {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  left: 0;
}
</style>
