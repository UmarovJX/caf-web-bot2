<script setup>
const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
});
function scroll(id) {
  window.scroll({
    top: document.getElementById(id).getBoundingClientRect().top - 100,
  });
}
</script>

<template>
  <div class="sidebar">
    <template v-for="(category, index) in props.categories" :key="index">
      <a
        v-if="category && category.products && category.products.length"
        class="sidebar-link l-large"
        :class="{ active: category.active }"
        @click="scroll(category.id)"
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
  align-items: center;
  gap: 5px;
  padding: 0 5px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border-radius: 0 0 20px 20px;
  z-index: 10;

  &::-webkit-scrollbar {
    display: none;
  }

  &-link {
    // writing-mode: vertical-rl;
    // text-orientation: mixed;
    // transform: rotate(180deg);
    color: var(--content_3);
    cursor: pointer;

    &.active {
      color: var(--content_1);
    }
  }
}
</style>
