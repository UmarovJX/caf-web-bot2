<script setup>
import { ref, watch } from "vue";
const sidebar = ref(null);
const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  active: {
    type: String,
  },
});
function scroll(id) {
  window.scroll({
    top:
      document.getElementById(id).getBoundingClientRect().top +
      window.scrollY -
      100,
  });
}
watch(
  () => props.active,
  (v) => {
    console.log(v);
    const target = sidebar.value.querySelector(`[data-id="${v}"]`);
    if (isInViewport(target))
      target.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
  }
);
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
</script>

<template>
  <div class="sidebar" ref="sidebar">
    <template v-for="(category, index) in props.categories" :key="index">
      <a
        v-if="category && category.products && category.products.length"
        class="sidebar-link l-large"
        :class="{ active: category.id === active }"
        @click="scroll(category.id)"
        :data-id="category.id"
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
  gap: 10px;
  padding: 10px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  z-index: 10;

  &::-webkit-scrollbar {
    display: none;
  }

  &-link {
    // writing-mode: vertical-rl;
    // text-orientation: mixed;
    // transform: rotate(180deg);
    min-width: fit-content;
    color: var(--content_3);
    border-radius: 10px;
    border: 1px solid var(--content_3);
    cursor: pointer;
    padding: 5px 10px;
    &.active {
      color: var(--content_1);
      border: 1px solid var(--content_1);
    }
  }
}
</style>
