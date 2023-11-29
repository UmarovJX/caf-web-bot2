<template>
  <h3 class="cf-title-large">
    <slot />
  </h3>
</template>

<style lang="scss" scoped>
.cf-title-large {
  font-family: Inter, sans-serif;
  font-style: normal;
  color: var(--content_1);
  letter-spacing: 0.15px;
  font-weight: 500;
  font-size: 22px;
  line-height: 28px;
}
</style>
