<script setup>
import { computed, onMounted, ref } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import api from "@/services/api";
import XIcon from "@/components/elements/material-icons/XIcon.vue";
import logo from "@/assets/logo.svg";
import { isNotUndefinedNullEmptyZero } from "@/util/inspect";
import { formatToPrice } from "@/util/formatter";
import TitleMedium from "@/components/reusable/title/TitleMedium.vue";
import VueElementLoading from "vue-element-loading";
import { TELEGRAM, WEB_APP } from "@/constants";

import { useI18n } from "@/locales";
import {
  mainButtonHideProgress,
  mainButtonMakeVisible,
  mainButtonOffClick,
  mainButtonOnClick,
  mainButtonShowProgress,
} from "@/util/main.button.util";

const { t } = useI18n();
// const locale = localStorage.getItem("locale") || "uz";

const route = useRoute();
const router = useRouter();
let product = ref({});
let imageUrl = ref(logo);
let variations = ref([]);
let isSaving = ref(false);
let isFetching = ref(false);
const liked = ref(false);
const counter = ref(0);
// const price = ref(1000);
const totalPrice = ref(0);
const addedToCart = ref(false);
const attributeCtx = ref({
  isFetching: false,
  id: null,
  price: 0,
  qty: 0,
  sku: null,
  image: null,
  uuid: null,
});

const toggleLiked = async () => {
  const productId = route.params.id;
  await api.product.setFavorite(productId).then((res) => {
    if (res) {
      liked.value = !liked.value;
    }
  });
};

const showCounterState = computed(() => {
  if (variations.value[0]) {
    return isNotUndefinedNullEmptyZero(variations.value[0].selected);
  } else {
    return false;
  }
});

async function fetchProductDetails() {
  startFetching();
  try {
    const { data } = await api.product.fetchProductItems({
      productId: route.params.id,
    });

    product.value = data;
    liked.value = product.value.is_favorite;
    product.value.attributes.forEach((attr) => {
      variations.value.push({
        id: attr.id,
        name: attr.name,
        selected: null,
      });
    });
    if (isNotUndefinedNullEmptyZero(product.value.image)) {
      imageUrl.value = product.value.image;
    }
    await attributeHandler(
      data.attributes[0].id,
      data.attributes[0].values[0].id
    );
  } finally {
    finishFetching();
  }
}

const calculateTotal = () => {
  totalPrice.value = counter.value * attributeCtx.value.price;
};

const counterChanger = ({ delta = 0, setter = false }) => {
  if (!attributeCtx.value.id) {
    return;
  }

  if (setter) {
    counter.value = delta;
  } else {
    counter.value += delta;
  }

  if (counter.value < 1) {
    counter.value = 1;
  }

  calculateTotal();
};

function startAttrFetching() {
  attributeCtx.value.isFetching = true;
}

function finishAttrFetching() {
  attributeCtx.value.isFetching = false;
}

function settleAttributeCtx(result) {
  attributeCtx.value.sku = result.sku;
  attributeCtx.value.qty = result.qty;
  attributeCtx.value.uuid = result.id;
  attributeCtx.value.image = result.image;
  attributeCtx.value.price = result.price;
  calculateTotal();
}

function resetCalculator() {
  counter.value = 1;
}

async function attributeHandler(attributeId, valueId) {
  const attrIdx = variations.value.findIndex(
    (variety) => variety.id === attributeId
  );

  attributeCtx.value.id = valueId;
  startAttrFetching();

  variations.value[attrIdx].selected = valueId;
  const selectedVariations = variations.value
    .filter((v) => isNotUndefinedNullEmptyZero(v.selected))
    .map((v) => {
      return {
        attribute_id: v.id,
        attribute_value_id: v.selected,
      };
    });

  if (selectedVariations.length) {
    try {
      const {
        data: { result },
      } = await api.product.fetchAttributeDetails(product.value.id, {
        attributes: selectedVariations,
      });

      resetCalculator();
      settleAttributeCtx(result);
    } finally {
      finishAttrFetching();
    }
  }
}

function activateRadioButton(attrId, valueId) {
  const v = variations.value.find((variety) => variety.id === attrId);
  return v.selected === valueId;
}

async function saveToBasket() {
  isSaving.value = true;
  mainButtonShowProgress();
  await api.basket
    .saveProductToBasket({
      productId: attributeCtx.value.uuid,
      count: counter.value,
    })
    .then(() => {
      addedToCart.value = true;
    })
    .finally(() => {
      mainButtonHideProgress();
      isSaving.value = false;
      setTimeout(() => {
        addedToCart.value = false;
      }, 3500);
    });
}

function startFetching() {
  isFetching.value = true;
}

function finishFetching() {
  isFetching.value = false;
}

const webApp = window[TELEGRAM][WEB_APP];

if (window[TELEGRAM][WEB_APP].colorScheme === "dark") {
  webApp.MainButton.color = "#D5C7C2";
  webApp.MainButton.textColor = "#1D0B00";
} else {
  webApp.MainButton.color = "#683724";
  webApp.MainButton.textColor = "#FFFFFF";
}
webApp.MainButton.setText(t("buttons.add_to_cart"));
mainButtonMakeVisible();

async function productViewButtonHandler() {
  if (!isSaving.value) {
    if (route.name === "product-view") {
      if (attributeCtx.value.uuid) {
        window[TELEGRAM][WEB_APP].MainButton.disable();
        await saveToBasket();
        window[TELEGRAM][WEB_APP].MainButton.enable();
        setTimeout(() => router.push({ name: "delivery-view" }), 500);
      }
    }
  }
}

onMounted(async () => {
  await fetchProductDetails();
});

const currency = JSON.parse(localStorage.getItem("currency")) || {
  id: 1,
  name: "So'm",
  type: "UZS",
};

mainButtonOnClick(productViewButtonHandler);
onBeforeRouteLeave(() => {
  mainButtonOffClick(productViewButtonHandler);
});

webApp.ready();
</script>

<template>
  <div
    :style="addedToCart ? 'padding-bottom:128px' : 'padding-bottom:72px'"
    class="custom-container product"
  >
    <vue-element-loading
      :active="isFetching"
      :is-full-screen="true"
      color="#683724"
    />

    <!--  PRODUCT MAIN IMG  -->
    <img :src="imageUrl" alt="product-image" />
    <!--  PRODUCT TITLE, DESCRIPTION AND LIKE  -->
    <div>
      <div class="d-flex justify-content-between align-items-center">
        <h3 class="product-title t-large">{{ product.name }}</h3>
        <div class="product-like" @click="toggleLiked">
          <x-icon v-if="liked" color="var(--brown)" name="favorite" size="20" />

          <x-icon
            v-else
            color="var(--brown)"
            name="favorite_border"
            size="20"
            type="outlined"
          />
        </div>
      </div>

      <p v-if="product.description" class="b-medium product-description">
        {{ product.description }}
      </p>
    </div>

    <!--  PRODUCT SIZES  -->
    <div class="product-sizes">
      <div v-for="(attribute, index) in product.attributes" :key="attribute.id">
        <title-medium class="cm-b-1">
          {{ attribute.name }}
        </title-medium>

        <div class="c-flex c-column-gap-1">
          <div
            v-for="attrValue in product.attributes[index].values"
            :key="attrValue.id"
            :class="{
              'c-radio-active': activateRadioButton(attribute.id, attrValue.id),
            }"
            class="square-radio-button c-flex c-justify-center c-align-center"
            @click="attributeHandler(attribute.id, attrValue.id)"
          >
            <vue-element-loading
              :active="
                attributeCtx.id === attrValue.id && attributeCtx.isFetching
              "
              background-color="transparent"
              color="#683724"
            />
            <span>
              {{ attrValue.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!--  PRODUCT COUNTER  -->
    <div class="product-counter">
      <div class="product-counter_block d-flex align-items-center">
        <button @click="counterChanger({ delta: -1 })">
          <x-icon color="var(--brown)" name="remove" size="16" />
        </button>
        <div>
          <span v-if="!!showCounterState">{{ counter }}</span>
          <span v-else>-</span>
        </div>
        <button @click="counterChanger({ delta: 1 })">
          <x-icon color="var(--brown)" name="add" size="16" />
        </button>
      </div>

      <div>
        <p v-if="attributeCtx.uuid" class="product-counter_price h-small">
          {{ formatToPrice(totalPrice) }} {{ currency["name"] }}
        </p>
        <p v-else class="product-counter_text b-large">
          {{ $t("others.choose_size") }}
        </p>
      </div>
    </div>

    <!--  PRODUCT ADD TO CART BTN  -->
    <div v-if="addedToCart" class="product-cart">
      <span :class="{ active: addedToCart }" class="product-cart_info l-large">
        {{ $t("buttons.added_to_cart") }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./product-style.scss" />
