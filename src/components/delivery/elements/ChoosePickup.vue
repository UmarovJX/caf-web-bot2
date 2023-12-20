<script setup>
import { onMounted, ref, watch } from "vue";
import VueElementLoading from "vue-element-loading";
import TitleMedium from "@/components/reusable/title/TitleMedium.vue";

import api from "@/services/api";
import { formatToPrice } from "@/util/formatter";
import {
  getPickupBranchSession,
  hasPickupBranchSession,
  savePickupBranchSession,
} from "@/util/address.util";
import { isNotUndefinedNullEmptyZero } from "@/util/inspect";

let checkedPickupValue = ref(null);

const nearestBranches = ref({
  list: [],
  isFetching: false,
});
const emits = defineEmits(["select"]);

watch(checkedPickupValue, () => {
  setPickupLocation();
});

function findPickupBranch({ id: branchId = checkedPickupValue.value }) {
  return nearestBranches.value.list.find(({ id }) => id === branchId);
}

function setPickupLocation() {
  const branch = findPickupBranch({});
  if (branch) {
    emits("select");
    savePickupBranchSession({ pickup: branch });
  } else if (nearestBranches.value.list.length) {
    savePickupBranchSession({ pickup: nearestBranches.value.list[0] });
  }
}

function setDefaultPickupBranch() {
  const { id: branchId } = getPickupBranchSession();
  if (isNotUndefinedNullEmptyZero(branchId)) {
    const hasInList = nearestBranches.value.list.find(
      ({ id }) => id === branchId
    );
    if (hasInList) {
      checkedPickupValue.value = branchId;
    }
  }
}

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
  } catch (e) {
    nearestBranches.value.list = [];
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
    if (data.result.length) {
      setDefaultPickupBranch();
    }
  } finally {
    nearestBranches.value.isFetching = false;
  }
}

function hasApplyPermission() {
  if (hasPickupBranchSession()) {
    emits("select");
  }
}

onMounted(() => {
  hasApplyPermission();
});

getPermissionToLocation();
getBranchList();
</script>

<template>
  <div class="pickup address-select-wrapper">
    <title-medium class="cm-b-2">Ближайшие адреса</title-medium>

    <div>
      <vue-element-loading
        :active="nearestBranches.isFetching"
        color="#683724"
        background-color="rgba(0, 0, 0, .2)"
      />
      <label
        v-for="option in nearestBranches.list"
        :key="option.id"
        :for="option.id"
        class="container container-2 b-large"
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
</template>

<style lang="scss" scoped>
.c-address-empty-message {
  color: var(--content_3);
  min-height: 8rem;
}
</style>
