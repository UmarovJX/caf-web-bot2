<script setup>
import XIcon from "@/components/elements/material-icons/XIcon.vue";
import api from "@/services/api";
import { onMounted, ref } from "vue";
import { TELEGRAM, WEB_APP } from "@/constants";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useI18n } from "@/locales";
import { mainButtonOffClick, mainButtonOnClick } from "@/util/main.button.util";

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const addresses = ref([]);

async function fetchClientAddresses() {
  const { data } = await api.client.getAddresses();
  addresses.value = data.result;
}

let webApp = window[TELEGRAM][WEB_APP];
webApp.MainButton.isVisible = false;

onMounted(async () => {
  await fetchClientAddresses();
});

webApp.MainButton.setText(t("buttons.add"));
if (window[TELEGRAM][WEB_APP].colorScheme === "dark") {
  webApp.MainButton.color = "#D5C7C2";
  webApp.MainButton.textColor = "#1D0B00";
} else {
  webApp.MainButton.color = "#683724";
  webApp.MainButton.textColor = "#FFFFFF";
}
webApp.MainButton.isVisible = true;

function addressViewMainButtonHandler() {
  webApp.MainButton.showProgress(true);
  window[TELEGRAM][WEB_APP].MainButton.disable();
  router.push({ name: "address-create" });
  webApp.MainButton.hideProgress();
  window[TELEGRAM][WEB_APP].MainButton.enable();
}

mainButtonOnClick(addressViewMainButtonHandler);
onBeforeRouteLeave(() => {
  mainButtonOffClick(addressViewMainButtonHandler);
});
</script>

<template>
  <div class="address">
    <div class="header d-flex align-items-center justify-content-between">
      <p class="header-title t-large">{{ $t("titles.my_addresses") }}</p>
      <!--      <router-link :to="{ name: 'address-create', path: 'address/create' }">-->
      <!--        <x-icon color="var(&#45;&#45;brown)" name="add" size="24" />-->
      <!--      </router-link>-->
    </div>

    <div v-if="addresses.length" class="custom-container">
      <router-link
        v-for="(address, index) in addresses"
        :key="index"
        :to="{ name: 'address-edit', params: { id: address.id } }"
        class="address-item d-flex align-items-center justify-content-between"
      >
        <div>
          <p class="b-large">{{ address.address }}</p>
          <span class="b-small"
            >{{ address.entrance }}, {{ address.floor }},
            {{ address.home }}</span
          >
        </div>

        <x-icon color="var(--brown)" name="edit" size="24" />
      </router-link>
    </div>

    <div v-else class="custom-container vh-100">
      <div class="d-flex flex-column align-items-center justify-content-center">
        <x-icon color="var(--content_3)" name="location_on" size="48" />
        <p>{{ $t("others.no_address") }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./address-style.scss" />
