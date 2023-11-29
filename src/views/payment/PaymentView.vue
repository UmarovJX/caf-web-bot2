<script setup>
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { nextTick, onMounted, ref, watch } from "vue";

import api from "@/services/api";
import { formatToPrice } from "@/util/formatter";

import VueElementLoading from "vue-element-loading";
import { TELEGRAM, WEB_APP } from "@/constants";
import {
  mainButtonMakeVisible,
  mainButtonOffClick,
  mainButtonOnClick,
  mainButtonSetText,
} from "@/util/main.button.util";

import { useI18n } from "vue-i18n";
import { useAddressStore } from "@/store/address/address.store";
import { addressDetailsComposable } from "@/composable/address.composable";
import { XIcon } from "@/components/elements/material-icons";
import DeliveryExpand from "@/components/delivery/DeliveryExpand.vue";
import {
  getAddressSession,
  getPickupBranchSession,
  getTableSession,
  hasAddressSession,
  hasPickupBranchSession,
  hasTableSession,
} from "@/util/address.util";

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const { active, closeDrawerHandler, openDrawerHandler, deliveryType } =
  useAddressStore();
const { addressInfo } = addressDetailsComposable();

let deliveryIcon = ref("location_on");
let isSubmitting = ref(false);
const preview = ref({
  isFetching: false,
  paymentPrices: [],
  paymentSystems: [],
});

const shop = ref({});

const invoice = ref({
  amount: 0,
  delivery_amount: 0,
  total_amount: 0,
});

const deliveryInformation = ref({
  id: "",
  name: null,
  region: null,
  address: null,
  location: {
    latitude: 69.2700806,
    longitude: 41.3006733,
  },
  entrance: "",
  floor: "",
  home: "",
  comment: "",
  is_primary: false,
});

let checkedPaymentOption = ref(null);

watch(
  () => active.value,
  (a) => {
    if (a) {
      changeMainButtonOnExpand();
    } else {
      mainButtonSetText(t("buttons.checkout"));
      mainButtonOffClick(confirmDeliveryDetails);
      mainButtonOnClick(paymentViewButtonHandler);
    }
  }
);

function confirmDeliveryDetails() {
  closeDrawerHandler();
  mainButtonSetText(t("buttons.checkout"));
  nextTick(() => {
    setTimeout(() => {
      mainButtonOffClick(confirmDeliveryDetails);
      mainButtonOnClick(paymentViewButtonHandler);
    }, 1000);
  });
}

function changeMainButtonOnExpand() {
  if (active.value) {
    mainButtonSetText("Подтвердить");
    mainButtonOffClick(paymentViewButtonHandler);
    mainButtonOnClick(confirmDeliveryDetails);
    mainButtonMakeVisible();
  }
}

async function fetchPreviewDetails() {
  startFetching();
  try {
    let bodyCtx = { type: deliveryType.value };
    switch (bodyCtx.type) {
      case "delivery": {
        if (hasAddressSession()) {
          const { id } = getAddressSession();
          bodyCtx.address_id = id;
        } else {
          openDrawerHandler();
        }
        break;
      }
      case "pickup": {
        if (hasPickupBranchSession()) {
          const { id } = getPickupBranchSession();
          bodyCtx.branch_id = id;
        } else {
          openDrawerHandler();
        }
        break;
      }
      case "table": {
        if (hasTableSession()) {
          const { id } = getTableSession();

          bodyCtx.table_id = id;
        } else {
          openDrawerHandler();
        }
      }
    }

    const response = await api.order.orderPreview(bodyCtx);
    if (response.data) {
      invoice.value = response.data.result.invoice;
      shop.value = response.data.result["shop"];
      deliveryInformation.value = response.data.result["delivery_information"];
      preview.value.paymentSystems = response.data.result["payment_systems"];
      checkedPaymentOption.value = preview.value.paymentSystems[0].id;
      initInvoice();
    }
  } catch (e) {
    console.error(e);
  } finally {
    finishFetching();
  }
}

function startFetching() {
  preview.value.isFetching = true;
}

function finishFetching() {
  preview.value.isFetching = false;
}

function initInvoice() {
  preview.value.paymentPrices.push({
    text: "В корзине",
    value: invoice.value.amount,
  });

  preview.value.paymentPrices.push({
    text: "Промокод",
    value: 0,
  });

  preview.value.paymentPrices.push({
    text: "Доставка",
    value: invoice.value.delivery_amount,
  });

  preview.value.paymentPrices.push({
    text: "Итого",
    value: invoice.value.total_amount,
  });
}

function getIdByDeliveryType() {
  switch (deliveryType.value) {
    case "delivery": {
      const { id } = getAddressSession();
      return id;
    }
    case "pickup": {
      const { id } = getPickupBranchSession();
      return id;
    }
    case "table": {
      const { id } = getTableSession();
      return id;
    }
  }
}

function findDeliveryIcon() {
  if (deliveryType.value === "pickup") {
    deliveryIcon.value = "hail";
  } else if (deliveryType.value === "table") {
    deliveryIcon.value = "table_restaurant";
  }
}

async function submitOrder() {
  window[TELEGRAM][WEB_APP].MainButton.disable();
  isSubmitting.value = true;
  try {
    const orderCtx = {
      type: deliveryType.value,
      payment_system_id: checkedPaymentOption.value,
      comment: "",
      products: [],
      pickup_at: new Date(),
    };

    if (deliveryType.value === "delivery") {
      orderCtx.address_id = getIdByDeliveryType();
    } else if (route.query.type === "pickup") {
      orderCtx.branch_id = getIdByDeliveryType();
      orderCtx.pickup_at = new Date();
    } else {
      orderCtx.table_id = getIdByDeliveryType();
    }

    const {
      data: { result },
    } = await api.client.getBasketItems();

    orderCtx.products = result.map((p) => ({
      qty: p.count,
      id: p.product.id,
    }));

    orderCtx.comment = route.query.comment;
    await api.order.createOrder(orderCtx).then(async () => {
      isSubmitting.value = false;
      await router.push({
        name: "orders-view",
        query: {
          done: "true",
        },
      });
    });
  } finally {
    isSubmitting.value = false;
    window[TELEGRAM][WEB_APP].MainButton.enable();
  }
}

function openDeliveryExpand() {
  openDrawerHandler();
}

async function paymentViewButtonHandler() {
  if (!isSubmitting.value) {
    if (route.name === "payment-view") {
      window[TELEGRAM][WEB_APP].MainButton.showProgress(true);
      await submitOrder();
      window[TELEGRAM][WEB_APP].MainButton.hideProgress();
    }
  }
}

function checkClientAddress() {
  switch (deliveryType.value) {
    case "delivery": {
      if (hasAddressSession()) {
        closeDrawerHandler();
      } else {
        openDrawerHandler();
      }
      break;
    }
    case "pickup": {
      if (hasPickupBranchSession()) {
        closeDrawerHandler();
      } else {
        openDrawerHandler();
      }
      break;
    }
    case "table": {
      if (hasTableSession()) {
        closeDrawerHandler();
      } else {
        openDrawerHandler();
      }
      break;
    }
  }
}

mainButtonSetText(t("buttons.checkout"));
onMounted(async () => {
  findDeliveryIcon();
  await fetchPreviewDetails();
  window[TELEGRAM][WEB_APP].MainButton.isVisible = true;
  if (checkedPaymentOption.value) {
    window[TELEGRAM][WEB_APP].MainButton.color = "#683724";
    window[TELEGRAM][WEB_APP].MainButton.textColor = "#FFFFFF";
    // window[TELEGRAM][WEB_APP].MainButton.enable();
  } else {
    window[TELEGRAM][WEB_APP].MainButton.color = "#F6F5F5";
    window[TELEGRAM][WEB_APP].MainButton.textColor = "#99918C";
    // window[TELEGRAM][WEB_APP].MainButton.disable();
  }
  checkClientAddress();
});

mainButtonOnClick(paymentViewButtonHandler);
onBeforeRouteLeave(() => {
  mainButtonOffClick(paymentViewButtonHandler);
  mainButtonOffClick(confirmDeliveryDetails);
});
</script>

<template>
  <div>
    <vue-element-loading
      :active="preview.isFetching"
      :is-full-screen="true"
      color="#683724"
    />
    <div class="payment">
      <div>
        <div class="header">
          <p class="header-title t-large">Оплата</p>
        </div>

        <div
          class="custom-container"
          style="box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12)"
        >
          <div class="payment-details">
            <img :src="shop.logo" alt="" />

            <div class="payment-details_text">
              <h4 class="t-medium">{{ shop.name }}</h4>
              <p class="b-small">
                {{ shop.description }}
              </p>
              <!--              <span class="b-small">CAF Coffee shop</span>-->
            </div>
          </div>
        </div>

        <div class="delivery-expand" @click="openDeliveryExpand">
          <x-icon :name="deliveryIcon" size="24" />
          <div
            class="delivery-expand__content c-flex c-column-gap-05 c-align-center"
          >
            <h5 class="delivery-expand__title">{{ addressInfo.type }}</h5>
            <div
              v-if="addressInfo.detail !== ''"
              class="delivery-expand__value"
            >
              {{ addressInfo.detail }}
            </div>
          </div>
          <x-icon class="delivery-expand__icon" name="expand_more" size="24" />
        </div>

        <div
          class="custom-container"
          style="box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12)"
        >
          <div
            v-for="(info, index) in preview.paymentPrices"
            :key="index"
            class="payment-info d-flex justify-content-between align-items-center"
          >
            <p class="b-large">{{ info.text }}</p>
            <span class="b-large">{{ formatToPrice(info.value) }} сум</span>
          </div>
        </div>

        <div class="custom-container cm-b-1">
          <div class="payment-type">
            <label
              v-for="pmSystem in preview.paymentSystems"
              :key="pmSystem.id"
              :for="'option-payment-system' + pmSystem.id"
              class="container b-large"
              >{{ pmSystem.name }}
              <input
                :id="'option-payment-system' + pmSystem.id"
                v-model="checkedPaymentOption"
                :name="'option-payment-system' + pmSystem.id"
                :value="pmSystem.id"
                type="radio"
              />
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
      </div>
      <delivery-expand
        @select="changeMainButtonOnExpand"
        @apply-delivery="changeMainButtonOnExpand"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped src="./payment-style.scss" />
