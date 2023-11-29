<script setup>
import { defineProps, onMounted, ref } from "vue";
import { isNotUndefinedNullEmptyZero } from "@/util/inspect";
import logo from "@/assets/logo.svg";
import { formatToPrice } from "@/util/formatter";
import { TELEGRAM, WEB_APP } from "@/constants";

let webApp = window[TELEGRAM][WEB_APP];

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: String,
    default: "",
  },
  image: {
    type: [String],
    default: "",
  },
});

let imageUrl = isNotUndefinedNullEmptyZero(props.image) ? props.image : logo;

const currency = JSON.parse(localStorage.getItem("currency")) || {
  id: 1,
  name: "So'm",
  type: "UZS",
};

webApp.ready();
</script>

<template>
  <div>
    <div class="card">
      <router-link
        :to="{ name: 'product-view', params: { id: props.product.id } }"
        class="card-img"
      >
        <img class="product-image" :src="imageUrl" :alt="props.description" />
        <p class="card-description t-small">
          {{ props.description }}
        </p>
        <span class="card-price b-small">
          {{ formatToPrice(price) }} {{ currency["name"] }}
          <!--          {{ props.price }}-->
          <!--          {{ $t("price.uzs") }}-->
        </span>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  &-img,
  .product-image {
    height: 136px;
    //height: 100%;
    //max-height: 136px;
    width: 136px;
    object-fit: cover;
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
