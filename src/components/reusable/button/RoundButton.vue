<script setup></script>

<template>
  <button class="c-round-button">
    <slot name="default" />
  </button>
</template>

<style lang="scss" scoped>
.c-round-button {
  color: var(--brown);
  background-color: var(--background_primary);
  border: 1px solid var(--content_3);
  border-radius: 100px;
  padding: 1rem;
  width: 100%;
  font-family: Inter, sans-serif;
  font-size: 14px;
  cursor: pointer;
}
</style>
