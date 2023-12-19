<script setup>
import { onUnmounted, ref } from "vue";

import { StreamBarcodeReader } from "vue-barcode-reader";

import scanImg from "@/assets/images/scanning.svg";
import { useRouter } from "vue-router";
import api from "@/services/api";
import { getRequestPageInQr, saveTableSession } from "@/util/address.util";

// const barcode = ref('')
// console.log(barcode);

// function openScan() {
//     console.log('console')
// return window.Telegram.WebApp.showScanQrPopup((event) => {
//     console.log(event, 'event');
// })
// }
const router = useRouter();
let scanEvent = ref("");
let scanType = ref("");

// const openScan = () => {
//   window.Telegram.WebApp.showScanQrPopup(() => {
//     // console.log(event, 'event');
//     // scanEvent.value = event
//     // if (event) {
//     // window.Telegram.WebApp.closeScanQrPopup((closeEvent) => {
//     //     scanEvent.value = closeEvent
//     // })
//     // }
//
//     window.Telegram.WebApp.onEvent((eventType, eventHandler) => {
//       console.log(eventType, "eventType");
//       console.log(eventHandler, "eventHandler");
//       scanEvent.value = eventHandler;
//       scanType.value = eventType;
//       // if (eventHandler) {
//       //     return window.Telegram.WebApp.closeScanQrPopup()
//       // }
//     });
//   });
//
//   // window.Telegram.WebApp.onEvent((eventType, eventHandler) => {
//   //     console.log(eventType, 'eventType');
//   //     console.log(eventHandler, 'eventHandler');
//   //     scanEvent.value = eventHandler
//   //     scanType.value = eventType
//   //     if (eventHandler) {
//   //         return window.Telegram.WebApp.closeScanQrPopup()
//   //     }
//   // })
// };

const scanResult = ref(null);

async function onDecode(event) {
  scanResult.value = event;
  const idxQuery = event.indexOf("?start=") + 7;
  const id = event.slice(idxQuery);

  const {
    data: {
      result: { delivery_information },
    },
  } = await api.order.orderPreview({
    type: "table",
    table_id: id,
  });

  saveTableSession({
    table: delivery_information,
  });

  const requestPageInQr = getRequestPageInQr();
  if (requestPageInQr === "payment-view") {
    await router.push({
      name: "payment-view",
    });
  } else {
    await router.push({
      name: "delivery-view",
    });
  }

  // router.push({
  //   name: "payment-view",
  //   query: {
  //     ...route.query,
  //     id: uuid,
  //     type: "table",
  //   },
  // });
}

// function onLoaded(event) {
//   console.log(event);
// }

function switchFlash() {}

onUnmounted(() => {
  window.Telegram.WebApp.onEvent((eventType, eventHandler) => {
    scanEvent.value = eventHandler;
    scanType.value = eventType;
    // if (eventHandler) {
    //     return window.Telegram.WebApp.closeScanQrPopup()
    // }
  });
});
</script>

<template>
  <div class="scanner">
    <div class="scan-head header">
      <p class="header-title t-large">Сканируйте</p>
      <!--      <x-icon-->
      <!--        color="var(&#45;&#45;black)"-->
      <!--        name="flash_on"-->
      <!--        size="24"-->
      <!--        @click="switchFlash"-->
      <!--      />-->
    </div>

    <!--    <div class="custom-container">-->
    <!--      &lt;!&ndash;      <h2 @click="openScan()">Open Scan</h2>&ndash;&gt;-->
    <!--      <div class="row">Result ==> {{ scanResult }}</div>-->
    <!--    </div>-->

    <div class="scanning-block">
      <img :src="scanImg" alt="" />
    </div>

    <StreamBarcodeReader @decode="onDecode"></StreamBarcodeReader>
  </div>
</template>

<style lang="scss" scoped src="./scanner.scss" />
