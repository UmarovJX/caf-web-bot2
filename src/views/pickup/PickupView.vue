<script setup>
import { ref, watch } from "vue";
import api from "@/services/api";
import { useClientStore } from "@/store/client/client.store";
import { formatToPrice } from "@/util/formatter";

import VueElementLoading from "vue-element-loading";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import {
  mainButtonActivate,
  mainButtonMakeVisible,
  mainButtonOffClick,
  mainButtonOnClick,
  mainButtonSetText,
} from "@/util/main.button.util";
import { useI18n } from "@/locales";

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

let checkedPickupValue = ref(route.query.id);
const client = useClientStore();

const nearestBranches = ref({
  list: [],
  isFetching: false,
});

watch(
  checkedPickupValue,
  (ltsValue) => {
    client.setDeliveryType("pickup");
    client.setPickupBranch(ltsValue);
    router.push({
      query: {
        ...route.query,
        location_edit: true,
        id: checkedPickupValue.value,
      },
    });
  },
  {
    deep: true,
  }
);

function getLocation() {
  nearestBranches.value.isFetching = true;
  return new Promise((resolve, reject) => {
    const success = (position) => resolve(position);
    const error = (error) => reject(error);
    navigator.geolocation.getCurrentPosition(success, error);
  });
}

async function getNearestBranches(lat, long) {
  try {
    const {
      data: { result },
    } = await api.branch.getAllBranches(lat, long);
    nearestBranches.value.list = result;
  } finally {
    nearestBranches.value.isFetching = false;
  }
}

async function getPermissionToLocation() {
  nearestBranches.value.list = [];
  try {
    const {
      coords: { latitude, longitude },
    } = await getLocation();
    await getNearestBranches(latitude, longitude);
  } catch (err) {
    console.error("Unable to get position", err);
  }
}

async function getBranchList() {
  try {
    const { data } = await api.branch.fetchAllBranches();
    nearestBranches.value.list = data.result;
  } finally {
    nearestBranches.value.isFetching = false;
    console.log("final");
  }
}

getPermissionToLocation();
getBranchList();

async function pickupViewButtonHandler() {
  await router.push({
    name: "payment-view",
    query: route.query,
  });
}

mainButtonSetText(t("buttons.add"));
mainButtonActivate();
mainButtonMakeVisible();

mainButtonOnClick(pickupViewButtonHandler);
onBeforeRouteLeave(() => {
  mainButtonOffClick(pickupViewButtonHandler);
});
</script>

<template>
  <div class="pickup address-select-wrapper">
    <vue-element-loading
      :active="nearestBranches.isFetching"
      :is-full-screen="true"
      color="#683724"
    />
    <div>
      <div class="header c-flex" style="justify-content: space-between">
        <p class="header-title t-large">{{ $t("dropdown.pickup") }}</p>
        <!--        <span>-->
        <!--          <x-icon color="var(&#45;&#45;black)" name="add" size="24" />-->
        <!--        </span>-->
      </div>
      <div class="pickup-content">
        <label
          v-for="option in nearestBranches.list"
          :key="option.id"
          :for="option.id"
          class="pickup-label"
        >
          <span class="pickup-option" style="display: block">
            <span class="pickup-option__title">{{ option.name }}</span>
            <span v-if="option.distance > 0" class="pickup-option__distance">
              {{ formatToPrice(option.distance) }} M от вас
            </span>
          </span>

          <input
            :id="option.id"
            v-model="checkedPickupValue"
            :value="option.id"
            name="pickup-option"
            type="radio"
          />
          <span class="checkmark"></span>
        </label>
      </div>
    </div>
    <!--    <div class="basket-button-wrapper">-->
    <!--      <router-link-->
    <!--        :class="{ active: true }"-->
    <!--        :disabled="false"-->
    <!--        :to="{-->
    <!--          name: 'payment-view',-->
    <!--          query: route.query,-->
    <!--        }"-->
    <!--        class="basket-button"-->
    <!--      >-->
    <!--        <x-icon color="var(&#45;&#45;white)" name="location_on" size="18" />-->

    <!--        <span class="l-large" style="display: block; margin-left: 0.5rem">-->
    <!--          {{ $t("buttons.edit") }}-->
    <!--        </span>-->
    <!--      </router-link>-->
    <!--    </div>-->
  </div>
</template>

<style lang="scss" scoped src="./pickup-style.scss"></style>
