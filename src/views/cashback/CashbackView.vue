<script setup>
import XIcon from "@/components/elements/material-icons/XIcon.vue";
import api from "@/services/api";
import { ref } from "vue";

const cashbackBalance = ref("");
const cashbackItems = ref([]);

async function getCashbackBalance() {
  await api.product
    .fetchCashbackBalance()
    .then((res) => {
      cashbackBalance.value = res.data.result.balance;
    })
    .catch((error) => {
      console.error;
    });
}

async function getCashback() {
  await api.product
    .fetchCashback()
    .then((res) => {
      cashbackItems.value = res.data.result;
    })
    .catch((error) => {
      console.error(error);
    });
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
  return `${day}-${month}-${year} ${checkHour}:${checkMinute}`;
}

getCashbackBalance();
getCashback();
</script>

<template>
  <div class="cashback">
    <div class="header">
      <p class="header-title t-large">Кешбэк</p>
    </div>

    <div class="custom-container">
      <div class="cashback-balance d-flex justify-content-between">
        <p class="b-large">Баланс кешбэка:</p>
        <span class="t-medium">{{ cashbackBalance }} сум</span>
      </div>
    </div>

    <div class="cashback-advice">
      <p class="b-medium">Вы можете использовать кэшбэк при оплате</p>
    </div>

    <div class="custom-container">
      <div class="cashback-history">
        <p class="cashback-history_title">История</p>

        <div class="cashback-history_items">
          <div
            v-for="cashback in cashbackItems"
            :key="cashback.id"
            class="cashback-history_item d-flex align-items-center"
          >
            <x-icon color="var(--brown)" name="redeem" size="24" />
            <div
              class="d-flex align-items-center justify-content-between w-100"
            >
              <p class="b-large">{{ formatDate(cashback.created_at) }}</p>
              <span class="t-medium">{{ cashback.amount }} сум</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./cashback-style.scss" />
