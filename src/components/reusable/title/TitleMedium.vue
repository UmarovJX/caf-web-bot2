<template>
  <h3 class="cf-title-medium">
    <slot />
  </h3>
</template>

<style lang="scss" scoped>
.cf-title-medium {
  font-family: Inter, sans-serif;
  font-style: normal;
  color: var(--content_1);
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
}
</style>
