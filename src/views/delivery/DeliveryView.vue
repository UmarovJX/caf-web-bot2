<script setup>
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { nextTick, onMounted, ref, watch } from "vue";

import { useI18n } from "@/locales";
import { vIntersectionObserver } from "@vueuse/components";

import VueElementLoading from "vue-element-loading";
import DeliverySection from "@/views/delivery/DeliverySection.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import AppHeader from "@/components/AppHeader.vue";
import DeliveryExpand from "@/components/delivery/DeliveryExpand.vue";

import { TELEGRAM, WEB_APP } from "@/constants";
import { useAddressStore } from "@/store/address/address.store";
import { useClientStore } from "@/store/client/client.store";

import { getLocalVar, setLocalVar } from "@/util/localstorage.util";
import {
  mainButtonMakeDisable,
  mainButtonMakeVisible,
  mainButtonOffClick,
  mainButtonOnClick,
  mainButtonSetText,
} from "@/util/main.button.util";

import api from "@/services/api";
import {
  hasAddressSession,
  hasPickupBranchSession,
  hasTableSession,
} from "@/util/address.util";
import { enableAppScroll } from "@/util/app.util";
import { useUser } from "@/composable/client";
import { useHomeInfo, useShopInfo } from "@/composable/cache";
const { t, locale } = useI18n();

async function checkUserLocale() {
  const { user } = await useUser();
  locale.value = user.value.language || locale.value;
}
checkUserLocale();

const route = useRoute();
const router = useRouter();

const clientStore = useClientStore();
const { active, closeDrawerHandler, openDrawerHandler, deliveryType } =
  useAddressStore();
const homeCategories = ref([]);
let basketCtx = ref({
  result: [],
  meta: {},
});

let isFetching = ref(false);

const activeAnchor = ref(null);
function intersectionHandler(isIntersecting, id) {
  console.log(isIntersecting);
  console.log(id);
  activeAnchor.value = id;
}
watch(
  () => active.value,
  (a) => {
    if (a) {
      changeMainButtonOnExpand();
      mainButtonOffClick(openCartView);
    } else {
      if (basketCtx.value.result.length) {
        mainButtonSetText(t("buttons.go_to_cart"));
        mainButtonOnClick(openCartView);
      } else {
        mainButtonOffClick(confirmDeliveryDetails);
        mainButtonMakeDisable();
      }
    }
  }
);

function confirmDeliveryDetails() {
  closeDrawerHandler();
  if (basketCtx.value.result.length) {
    mainButtonSetText(t("buttons.go_to_cart"));
    nextTick(() => {
      mainButtonOnClick(openCartView);
    });
  } else {
    mainButtonMakeDisable();
  }
}

function changeMainButtonOnExpand() {
  mainButtonSetText("Подтвердить");
  mainButtonOffClick(openCartView);
  mainButtonOnClick(confirmDeliveryDetails);
  mainButtonMakeVisible();
}

async function fetchHomeItems() {
  isFetching.value = true;
  try {
    const res = await useHomeInfo();
    homeCategories.value = res;
    activeAnchor.value = res[0].id;
  } finally {
    isFetching.value = false;
  }
}

async function fetchBasketProducts() {
  isFetching.value = true;
  try {
    const {
      data: { result, meta },
    } = await api.basket.fetchBasketProducts();
    basketCtx.value.result = result;
    basketCtx.value.meta = meta;
  } finally {
    isFetching.value = false;
  }
}

let webApp = window[TELEGRAM][WEB_APP];

async function authenticateClient() {
  clientStore.initializeClient({ webApp: window[TELEGRAM][WEB_APP] });
  const clientId = window[TELEGRAM][WEB_APP].initDataUnsafe?.user?.id;
  const {
    data: { result },
  } = await api.auth.signIn(clientId);
  setLocalVar("access_token", result["access_token"]);
  setLocalVar("expired_in", result["expired_in"]);
}

async function fetchItems() {
  const requests = [fetchBasketProducts(), fetchHomeItems()];
  await Promise.allSettled(requests)
    .then(() => {
      if (basketCtx.value.result.length) {
        if (route.name === "delivery-view") {
          mainButtonMakeVisible();
          mainButtonOnClick(openCartView);
        }
      } else {
        mainButtonMakeDisable();
      }

      if (active.value) {
        const tableCondition =
          deliveryType.value === "table" && hasTableSession();
        const deliveryCondition =
          deliveryType.value === "delivery" && hasAddressSession();
        const pickupCondition =
          deliveryType.value === "pickup" && hasPickupBranchSession();

        if (tableCondition || deliveryCondition || pickupCondition) {
          changeMainButtonOnExpand();
        } else {
          mainButtonMakeDisable();
        }
      }
    })
    .finally(async () => {
      try {
        const { data } = await useShopInfo();
        localStorage.setItem("currency", JSON.stringify(data.result.currency));
      } catch (e) {
        console.error(e, "error");
      }
    });
}

function openCartView() {
  if (route.name === "delivery-view") {
    window[TELEGRAM][WEB_APP].MainButton.disable();
    webApp.MainButton.showProgress(true);
    router.push({ name: "cart-view" });
    webApp.MainButton.hideProgress();
    window[TELEGRAM][WEB_APP].MainButton.enable();
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

mainButtonMakeDisable();
onMounted(async () => {
  enableAppScroll();
  const accessToken = getLocalVar("access_token");
  mainButtonSetText(t("buttons.go_to_cart"));
  if (window[TELEGRAM][WEB_APP].colorScheme === "dark") {
    webApp.MainButton.color = "#D5C7C2";
    webApp.MainButton.textColor = "#1D0B00";
  } else {
    webApp.MainButton.color = "#683724";
    webApp.MainButton.textColor = "#FFFFFF";
  }
  if (accessToken) {
    await fetchItems();
  } else {
    await authenticateClient().then(async () => await fetchItems());
  }
});

checkClientAddress();

mainButtonOnClick(openCartView);
onBeforeRouteLeave(() => {
  mainButtonOffClick(openCartView);
  mainButtonOffClick(confirmDeliveryDetails);
});
</script>

<template>
  <div class="home-wrapper">
    <vue-element-loading
      :active="isFetching"
      :is-full-screen="true"
      color="#683724"
    />

    <app-header />
    <app-sidebar :categories="homeCategories" />
    <div class="page-layout">
      <div class="delivery d-flex flex-column">
        <delivery-section
          v-for="category in homeCategories"
          v-intersection-observer="
            ([{ isIntersecting }]) =>
              intersectionHandler(isIntersecting, category.id)
          "
          :key="category.id"
          :category="category"
          :products="category.products"
          :title="category.name"
        />
      </div>
    </div>

    <delivery-expand
      @select="changeMainButtonOnExpand"
      @apply-delivery="changeMainButtonOnExpand"
    />
    <div
      class="backdrop"
      v-if="active"
      style="
        position: absolute;
        height: 100vh;
        width: 100%;
        top: 0;
        left: 0;
        backdrop-filter: blur(2px);
        z-index: 11;
      "
    ></div>
  </div>
</template>

<style lang="scss" scoped src="./delivery-style.scss" />
