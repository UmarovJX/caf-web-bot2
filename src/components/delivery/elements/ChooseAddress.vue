<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import VueElementLoading from "vue-element-loading";
import TitleMedium from "@/components/reusable/title/TitleMedium.vue";
import RoundButton from "@/components/reusable/button/RoundButton.vue";
import { XIcon } from "@/components/elements/material-icons";

import api from "@/services/api";
import {
  getAddressSession,
  saveAddressSession,
  saveRequestPageInCreateAddress,
} from "@/util/address.util";
import { mainButtonMakeVisible } from "@/util/main.button.util";
import { isNotUndefinedNullEmptyZero } from "@/util/inspect";

const route = useRoute();
const router = useRouter();

const emits = defineEmits(["select"]);

const address = ref({
  list: [],
  isFetching: false,
  select: null,
});

watch(
  () => address.value.select,
  () => {
    setClientAddress();
  }
);

function findAddress({ id: addressId = address.value.select }) {
  return address.value.list.find(({ id }) => id === addressId);
}

function setClientAddress() {
  const ctx = findAddress({});
  if (ctx) {
    mainButtonMakeVisible();
    emits("select");
    saveAddressSession({ address: ctx });
  }
}

function startFetching() {
  address.value.isFetching = true;
}

function finishFetching() {
  address.value.isFetching = false;
}

function setDefaultAddress() {
  const { id: addressId } = getAddressSession();
  if (isNotUndefinedNullEmptyZero(addressId)) {
    const hasInList = address.value.list.find(({ id }) => id === addressId);
    if (hasInList) {
      address.value.select = addressId;
    }
  }
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
    if (address.value.list.length) {
      setDefaultAddress();
    }
  } finally {
    finishFetching();
  }
}

function createNewAddress() {
  saveRequestPageInCreateAddress({
    name: route.name,
  });
  router.push({
    name: "checkout-address-create",
  });
}

fetchClientAddress();
</script>

<template>
  <div class="address-select-wrapper">
    <vue-element-loading
      :active="address.isFetching"
      :is-full-screen="true"
      color="#683724"
    />
    <title-medium class="cm-b-2">Мои адреса</title-medium>
    <div>
      <label
        v-for="direct in address.list"
        :key="direct.id"
        :for="direct.id"
        class="container container-2 b-large"
      >
        <span class="pickup-option_title">{{ `${direct.address} ` }} </span>
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
      <div
        v-if="!address.list.length"
        class="c-address-empty-message c-flex c-align-center justify-content-center"
      >
        У вас нет адресов
      </div>
      <round-button
        class="c-flex c-align-center justify-content-center"
        @click="createNewAddress"
      >
        <x-icon name="location_on" />
        <span class="cm-l-1"> Добавить адрес </span>
      </round-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.c-address-empty-message {
  color: var(--content_3);
  min-height: 8rem;
}
</style>
