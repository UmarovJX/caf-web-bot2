<script setup>
import { onMounted, ref, watch } from "vue";

import { TELEGRAM, WEB_APP } from "@/constants";
import XIcon from "@/components/elements/material-icons/XIcon.vue";
import VueElementLoading from "vue-element-loading";
import { isNotUndefinedNullEmptyZero } from "@/util/inspect";
import api from "@/services/api";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const activeTab = ref("all");

const myOrdersTabs = ref([
  {
    id: 1,
    name: "all",
    status: "all",
    icon: "apps",
  },
  {
    id: 2,
    name: "in_way",
    status: "in_way",
    icon: "local_shipping",
  },
  {
    id: 3,
    name: "order_history",
    status: "closed",
    icon: "history",
  },
]);

const list = ref([]);
const listLoading = ref(true);

async function fetchOrders() {
  listLoading.value = true;
  try {
    let query = {
      status: null,
    };
    if (activeTab.value !== "all") {
      query = {
        status: activeTab.value,
      };
    }
    const {
      data: { result },
    } = await api.order.getOrders(query);
    list.value = result;
  } finally {
    listLoading.value = false;
  }
}

watch(activeTab, async (ltsValue) => {
  if (ltsValue) {
    await fetchOrders();
  }
});

function getIconStatus(status) {
  let icon = null;
  myOrdersTabs.value.forEach((item) => {
    if (status === item.status) {
      icon = item.icon;
    }
  });
  return icon || "apps";
}

function statusCheck(status) {
  if (isNotUndefinedNullEmptyZero(status)) {
    return t(`${status}`);
  }
  return "";
}

function formatDate(item) {
  const date = new Date(item);
  const year = date.getFullYear();
  const baseMonth = date.getMonth() + 1;
  const month = baseMonth < 10 ? `0${baseMonth}` : baseMonth;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  let hour = date.getHours();
  const minute = date.getMinutes();
  const checkHour = hour < 10 ? "0" + hour : hour;
  const checkMinute = minute < 10 ? "0" + minute : minute;
  return `${checkHour}:${checkMinute}, ${day}-${month}-${year}`;
}

function changeTab(status) {
  activeTab.value = status;
}

const currency = JSON.parse(localStorage.getItem("currency")) || {
  id: 1,
  name: "So'm",
  type: "UZS",
};

const webApp = window[TELEGRAM][WEB_APP];
webApp.MainButton.isVisible = false;

fetchOrders();

webApp.ready();
</script>

<template>
  <div class="orders">
    <div class="header">
      <p class="header-title t-large">{{ $t("titles.my_orders") }}</p>
    </div>
  </div>

  <div class="c-tabs-panel-wrapper">
    <div
      v-for="tab in myOrdersTabs"
      :key="tab.id"
      :class="{ active: tab.status === activeTab }"
      class="c-tabs-panel"
      @click="changeTab(tab.status)"
    >
      <x-icon :name="tab.icon" color="var(--brown)" size="18" />
      <p style="white-space: nowrap">{{ $t(`${tab.name}`) }}</p>
    </div>
  </div>

  <div class="orders-body">
    <div class="orders-body-tab">
      <vue-element-loading
        :active="listLoading"
        background-color="transparent"
        color="#683724"
        style="margin-top: 50px"
      />
      <div v-show="!listLoading" class="orders-body-list">
        <template v-if="list.length">
          <div
            v-for="item in list"
            :key="item.id"
            class="orders-body-list-item d-flex align-items-center"
          >
            <div class="item-img">
              <x-icon
                :name="getIconStatus(item.status)"
                color="var(--brown)"
                size="24"
              />
            </div>

            <div class="item-details d-flex flex-column w-100">
              <div
                class="item-sum d-flex align-items-center justify-content-between"
              >
                <p>
                  {{ $t("others.order") }} - {{ item.id.substring(0, 12) }}...
                </p>
                <p>{{ item.price }} {{ currency["name"] }}</p>
              </div>
              <div class="item-status">
                <div>
                  <p v-if="item.status !== 'closed'">
                    {{ statusCheck(item.status) }}
                  </p>
                  <p v-else>
                    {{ formatDate(item.delivered_at) }}
                  </p>
                </div>
                <p>{{ formatDate(item.created_at) }}</p>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="no-orders-wrapper">
            {{ $t("order.empty") }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped src="./orders-view.scss" />
