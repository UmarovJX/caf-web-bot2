<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.878 8.36302C17.3588 7.8817 18.138 7.8817 18.6353 8.34698C18.884 8.58764 19 8.89248 19 9.21336C19 9.5182 18.884 9.82303 18.6353 10.0476L12.8828 15.647C12.6507 15.8716 12.3357 16 12.0041 16C11.6726 16 11.3576 15.8716 11.1255 15.647L5.373 10.0476C4.87567 9.58237 4.87567 8.8283 5.373 8.34698C5.85376 7.8817 6.6495 7.8817 7.13025 8.36302L12.0041 13.096L16.878 8.36302Z" :fill="fill"/>
  </svg>
</template>
<script>
export default {
  name: "BaseDownIcon",
  props: {
    fill: {
      type: String,
      default: '#9CA3AF'
    },
    width: {
      type: Number,
      default: 24
    },
    height: {
      type: Number,
      default: 24
    }
  }
}
</script>
