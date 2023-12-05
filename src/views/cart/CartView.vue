<script setup>
import { ref, watch } from "vue";
import api from "@/services/api";
import VueElementLoading from "vue-element-loading";
import CartItem from "@/views/cart/CartItem.vue";
import AppHeader from "@/components/AppHeader.vue";
import { useClientStore } from "@/store/client/client.store";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { objNotEmptyNullUndefined } from "@/util/object";
import { TELEGRAM, WEB_APP } from "@/constants";
import { useI18n } from "@/locales";
import {
  mainButtonMakeDisable,
  mainButtonMakeVisible,
  mainButtonOffClick,
  mainButtonOnClick,
} from "@/util/main.button.util";
import TitleMedium from "@/components/reusable/title/TitleMedium.vue";

const { t } = useI18n();

const router = useRouter();
const route = useRoute();
const client = useClientStore();

const basket = ref({
  items: [],
  meta: {},
  isFetching: false,
  comment: "",
  promoCode: "",
});

const addresses = ref({
  list: [],
  isFetching: false,
});

const checkoutButton = ref({
  isBusy: false,
});

const openDeliveryCollapse = ref(false);

watch(basket.value.items, (items) => {
  console.log("items", items);
  if (!items.length) {
    console.log("inline");
    mainButtonMakeDisable();
    mainButtonOffClick(cartViewButtonHandler);
  }
});

async function fetchBasketProducts() {
  basket.value.isFetching = true;
  mainButtonMakeDisable();
  try {
    const {
      data: { result, meta },
    } = await api.client.getBasketItems();

    basket.value.items = result;
    basket.value.meta = meta;
  } finally {
    basket.value.isFetching = false;
    if (basket.value.items.length) {
      mainButtonMakeVisible();
    }
  }
}

function startChButtonLoading() {
  checkoutButton.value.isBusy = true;
}

function finishChButtonLoading() {
  checkoutButton.value.isBusy = false;
}

async function fetchClientAddresses() {
  startChButtonLoading();
  try {
    const {
      data: { result },
    } = await api.client.getAllAddresses({
      params: {
        limit: 20,
      },
    });

    if (!result.length) {
      await redirectPaymentView({
        type: "delivery",
        id: undefined,
        comment: basket.value.comment || "",
      });
      return;
    }

    addresses.value.list = result;
    const primaryAddress = result.find((address) => address.is_primary);
    if (primaryAddress) {
      client.setDeliveryType("delivery");
      client.setPrimaryAddress(primaryAddress);
      await redirectPaymentView({
        type: "delivery",
        id: primaryAddress.id,
        comment: basket.value.comment || "",
      });
      finishChButtonLoading();
    } else {
      client.setDeliveryType("delivery");
      client.setPrimaryAddress(result[0]);
      await redirectPaymentView({
        type: "delivery",
        id: result[0].id,
        comment: basket.value.comment || "",
      });
      finishChButtonLoading();
    }
  } catch (e) {
    console.error(e);
  }
}

function redirectPaymentView(query = {}) {
  router.push({
    name: "payment-view",
    query,
  });
}

function openCheckout() {
  switch (client.deliveryType) {
    case "delivery": {
      if (objNotEmptyNullUndefined(client.primaryAddress)) {
        return redirectPaymentView({
          type: "delivery",
          id: client.primaryAddress.id ?? undefined,
          comment: basket.value.comment || "",
        });
      }
      fetchClientAddresses();
      break;
    }

    case "pickup": {
      if (objNotEmptyNullUndefined(client.pickupBranch)) {
        return redirectPaymentView({
          type: "pickup",
          id: client.pickupBranch.id ?? undefined,
          comment: basket.value.comment || "",
        });
      }
      fetchClientAddresses();
      break;
    }

    case "table": {
      if (objNotEmptyNullUndefined(client.clientTable)) {
        return redirectPaymentView({
          type: "table",
          id: client.clientTable.id ?? undefined,
          comment: basket.value.comment || "",
        });
      }
      fetchClientAddresses();
    }
  }
}

function turnCheckoutButtonOff() {
  checkoutButton.value.isBusy = false;
}

let webApp = window[TELEGRAM][WEB_APP];

setTimeout(() => {
  webApp.MainButton.setText(t("buttons.go_to_payment"));
  if (window[TELEGRAM][WEB_APP].colorScheme === "dark") {
    window[TELEGRAM][WEB_APP].MainButton.color = "#D5C7C2";
    window[TELEGRAM][WEB_APP].MainButton.textColor = "#1D0B00";
  } else {
    window[TELEGRAM][WEB_APP].MainButton.color = "#683724";
    window[TELEGRAM][WEB_APP].MainButton.textColor = "#FFFFFF";
  }
}, 0);

mainButtonMakeDisable();

async function cartViewButtonHandler() {
  if (route.name === "cart-view") {
    window[TELEGRAM][WEB_APP].MainButton.disable();
    webApp.MainButton.showProgress(true);
    await openCheckout();
    webApp.MainButton.hideProgress();
    window[TELEGRAM][WEB_APP].MainButton.enable();
  }
}

fetchBasketProducts();

if (!basket.value.items.length) {
  mainButtonOnClick(cartViewButtonHandler);
}
onBeforeRouteLeave(() => {
  mainButtonOffClick(cartViewButtonHandler);
});
</script>

<template>
  <div class="cart">
    <app-header
      v-if="openDeliveryCollapse"
      :open-delivery="openDeliveryCollapse"
      @turn-loading-off="turnCheckoutButtonOff"
    />

    <vue-element-loading
      :active="basket.isFetching"
      :is-full-screen="true"
      color="#683724"
    />
    <div :class="{ 'cm-t-3': openDeliveryCollapse }" class="header">
      <p class="cart-title t-large cm-t-1">{{ $t("titles.cart") }}</p>
    </div>

    <div v-if="basket.items.length" class="ch-content-wrapper">
      <div class="custom-container">
        <div class="cart-list">
          <div
            v-for="(item, index) in basket.items"
            :key="index"
            class="cart-item d-flex align-items-start justify-content-between"
          >
            <cart-item
              :item="item"
              @update-list="fetchBasketProducts"
            ></cart-item>
          </div>
        </div>
      </div>

      <div class="ch-content-item">
        <div class="cart-promocode">
          <input
            v-model="basket.promoCode"
            :placeholder="$t('labels_placeholders.promocode')"
            class="b-large"
            type="text"
          />
        </div>

        <div class="cart-comment">
          <input
            v-model="basket.comment"
            :placeholder="$t('labels_placeholders.add_comment')"
            class="b-large"
            type="text"
          />
        </div>

        <p class="cart-comment_text b-medium">
          {{ $t("others.cart_comment") }}
        </p>
      </div>
    </div>
    <div v-else class="cart-empty-message">
      <title-medium> В корзине пока нет товаров</title-medium>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./cart-style.scss" />
