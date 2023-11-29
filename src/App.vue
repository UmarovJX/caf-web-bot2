<script setup>
import { onMounted, watch } from "vue";
import { TELEGRAM, WEB_APP } from "@/constants/index.js";
import { useRoute, useRouter } from "vue-router";
import { HandleBackButton } from "@/util/back.button.util";

const route = useRoute();
const router = useRouter();

window[TELEGRAM][WEB_APP].isClosingConfirmationEnabled = true;

function setBgColor() {
  if (window[TELEGRAM][WEB_APP].colorScheme === "dark") {

    document.getElementById("app").style.backgroundColor =
      "var(--background-primary)";
    window[TELEGRAM][WEB_APP].themeParams.bg_color = "#1D0B00";
    window[TELEGRAM][WEB_APP].setBackgroundColor("#1D0B00");
    setTimeout(() => {
      window[TELEGRAM][WEB_APP].setHeaderColor(
        window[TELEGRAM][WEB_APP].themeParams.bg_color
      );
    }, 100);
  } else {
    document.getElementById("app").style.backgroundColor =
      "var(--background-primary)";
    window[TELEGRAM][WEB_APP].themeParams.bg_color = "#FFFFFF";
    window[TELEGRAM][WEB_APP].setBackgroundColor("#FFFFFF");
    setTimeout(() => {
      window[TELEGRAM][WEB_APP].setHeaderColor(
        window[TELEGRAM][WEB_APP].themeParams.bg_color
      );
    }, 100);
  }
}

const setBackBtn = async () => {
  window[TELEGRAM][WEB_APP].BackButton.isVisible =
    route.name !== "delivery-view";

  window[TELEGRAM][WEB_APP].BackButton.onClick(() => {
    window[TELEGRAM][WEB_APP].BackButton.isVisible =
      route.name !== "delivery-view";
  });
  await setBgColor();
};

watch(
  route,
  () => {
    setBackBtn();
  },
  {
    immediate: true,
  }
);

const backButton = new HandleBackButton(router, route);
onMounted(() => {
  setBgColor();
  window[TELEGRAM][WEB_APP].BackButton.onClick((e) => backButton.binding(e));
});
</script>

<template>
  <div id="app-body" class="app-body">
    <router-view />
  </div>
</template>

<style lang="scss">
@import "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,1,0";
@import "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0";

.app-body {
  //background: var(--background_secondary);
  min-height: 100vh;
}
</style>
