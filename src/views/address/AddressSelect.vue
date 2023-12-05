<script setup>
import { ref, unref, watch } from "vue";
import api from "@/services/api";
import { useClientStore } from "@/store/client/client.store";
import { useRoute, useRouter } from "vue-router";

import { XIcon } from "@/components/elements/material-icons";
import VueElementLoading from "vue-element-loading";
import { TELEGRAM, WEB_APP } from "@/constants";

import { useI18n } from "@/locales";

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const address = ref({
  list: [],
  isFetching: false,
  select: route.query.id,
});

const client = useClientStore();

watch(
  () => address.value.select,
  () => {
    client.setDeliveryType("delivery");
    setClientAddress();
  }
);

async function setClientAddress() {
  if (!address.value.list.length) {
    return;
  }

  // const a = address.value.list.find((ads) => ads.id === address.value.select);

  client.setDeliveryType("delivery");
  client.setPrimaryAddress(address);

  sessionStorage.setItem("checkout-address", JSON.stringify(unref(address)));
  await router.push({
    query: {
      ...route.query,
      location_edit: true,
      id: address.value.select,
    },
  });

  // if (!a.is_primary) {
  //   await api.client.addressPrimary({
  //     addressId: address.value.select,
  //   });
  // }
}

function startFetching() {
  address.value.isFetching = true;
}

function finishFetching() {
  address.value.isFetching = false;
}

async function fetchClientAddress() {
  startFetching();
  try {
    const {
      data: { result },
    } = await api.client.getAllAddresses({
      params: {
        perPage: 80,
      },
    });
    address.value.list = result;
    // if (result.length) {
    // const l = result.find((a) => a.id === route.query.id);
    // if (l) {
    //   address.value.select = l;
    // }
    // const primaryAddress = result.find((a) => a["is_primary"]);
    // if (primaryAddress) {
    //   address.value.select = primaryAddress.id;
    // } else {
    //   address.value.select = result[0].id;
    // }
    // await setClientAddress();
    // }
  } finally {
    finishFetching();
  }
}

function createNewAddress() {
  router.push({
    name: "checkout-address-create",
    query: {
      ...route.query,
      from: "checkout",
    },
  });
}

fetchClientAddress();

window[TELEGRAM][WEB_APP].MainButton.setText(t("buttons.edit"));

if (window[TELEGRAM][WEB_APP].colorScheme === "dark") {
  window[TELEGRAM][WEB_APP].MainButton.color = "#D5C7C2";
  window[TELEGRAM][WEB_APP].MainButton.textColor = "#1D0B00";
} else {
  window[TELEGRAM][WEB_APP].MainButton.color = "#683724";
  window[TELEGRAM][WEB_APP].MainButton.textColor = "#FFFFFF";
}

window[TELEGRAM][WEB_APP]["onEvent"]("mainButtonClicked", () => {
  if (route.name === "address-select") {
    window[TELEGRAM][WEB_APP].MainButton.disable();
    window[TELEGRAM][WEB_APP].MainButton.showProgress(true);
    router.push({ name: "payment-view", query: route.query });
    window[TELEGRAM][WEB_APP].MainButton.enable();
    window[TELEGRAM][WEB_APP].MainButton.hideProgress();
  }
});

window[TELEGRAM][WEB_APP].MainButton.isVisible = true;
</script>

<template>
  <div class="address-select-wrapper">
    <vue-element-loading
      :active="address.isFetching"
      :is-full-screen="true"
      color="#683724"
    />
    <div>
      <!--      <div class="header d-flex align-items-center justify-content-between">-->
      <!--        <p class="header-title t-large">Выберите адрес</p>-->
      <!--      </div>-->
      <div class="header d-flex align-items-center justify-content-between">
        <p class="header-title t-large">Выберите адрес</p>
        <span style="cursor: pointer" @click="createNewAddress">
          <x-icon color="var(--brown)" name="add" size="24" />
        </span>
      </div>
      <div class="header-body_content">
        <div class="custom-container">
          <div>
            <div class="header-body_block">
              <label
                v-for="direct in address.list"
                :key="direct.id"
                :for="direct.id"
                class="container container-2 b-large"
              >
                <span class="pickup-option_title">{{ direct.address }}</span>
                <span class="pickup-option_distance">
                  <span v-if="direct.entrance">
                    {{ direct.entrance }}
                  </span>
                  <span v-if="direct.floor"> , {{ direct.floor }} </span>
                  <span v-if="direct.home"> , {{ direct.home }} </span>
                </span>
                <input
                  :id="direct.id"
                  v-model="address.select"
                  :value="direct.id"
                  name="pickup-option"
                  type="radio"
                />

                <span class="checkmark checkmark-2"></span>
              </label>

              <!--              <router-link-->
              <!--                :to="{-->
              <!--                  name: 'address-create',-->
              <!--                }"-->
              <!--                class="stol-btn"-->
              <!--              >-->
              <!--                <x-icon color="var(&#45;&#45;brown)" name="location_on" size="18" />-->
              <!--                <span class="l-large stol-btn_text">Добавить адрес</span>-->
              <!--              </router-link>-->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    <div class="basket-button-wrapper">-->
    <!--      <router-link-->
    <!--        class="basket-button"-->
    <!--        :class="{ active: true }"-->
    <!--        :disabled="false"-->
    <!--        :to="{-->
    <!--          name: 'payment-view',-->
    <!--          query: route.query,-->
    <!--        }"-->
    <!--      >-->
    <!--        <x-icon color="var(&#45;&#45;white)" name="location_on" size="18" />-->

    <!--        <span style="display: block; margin-left: 0.5rem" class="l-large">-->
    <!--          Применить-->
    <!--        </span>-->
    <!--      </router-link>-->
    <!--    </div>-->
  </div>
</template>

<style lang="scss" scoped>
.header-body_content {
  padding: 0.5rem 0;
  //border-top: 12px solid var(--background_secondary);

  & .pickup {
    &-title {
      color: var(--brown);
      margin-bottom: 1.5rem;
    }

    &-option_title {
      display: block;
    }

    &-option_distance {
      display: block;
    }
  }

  & .stol-title {
    margin-bottom: 1rem;
  }

  & .stol-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
    border-radius: 100px;
    border: 1px solid var(--content_3);
    background-color: var(--background_primary);
    margin-bottom: 0.5rem;

    &_text {
      margin-left: 0.5rem;
      color: var(--brown);
    }
  }
}

.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 1rem;
  cursor: pointer;
  color: var(--content_2);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.container-2 {
  margin-bottom: 2rem;
}

/* Hide the browser's default radio button */
.container input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom radio button */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  width: 24px;
  background-color: transparent;
  border: 1px solid var(--content_3);
  border-radius: 50%;
}

.checkmark-2 {
  top: 50%;
  transform: translateY(-50%);
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the radio button is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: transparent;
  border: 2px solid var(--brown);
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.container .checkmark:after {
  top: 4px;
  left: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--brown);
}

.basket-button-wrapper {
  position: sticky;
  bottom: 0;
}

.basket-button {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  z-index: 20;
  background-color: var(--brown);
  color: var(--white);

  & p {
    color: var(--white);
    margin-left: 0.5rem;
  }
}

.address-select-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
}
</style>
