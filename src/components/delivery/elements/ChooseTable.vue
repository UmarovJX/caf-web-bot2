<script setup>
import { onMounted, reactive } from "vue";

import TitleMedium from "@/components/reusable/title/TitleMedium.vue";
import RoundButton from "@/components/reusable/button/RoundButton.vue";
import { XIcon } from "@/components/elements/material-icons";
import api from "@/services/api";

import {
  getTableSession,
  hasTableSession,
  //saveRequestPageInQr,
} from "@/util/address.util";
import { isNotUndefinedNullEmptyZero } from "@/util/inspect";

const tableDetails = reactive({
  id: null,
  name: null,
  branchId: null,
  branchName: null,
});

const emits = defineEmits(["select"]);

function initializeTableDetails() {
  if (hasTableSession()) {
    emits("select");

    const { id, name, branchId, branchName } = getTableSession();
    tableDetails.id = id;
    if (isNotUndefinedNullEmptyZero(name)) {
      tableDetails.name = name;
    }

    if (isNotUndefinedNullEmptyZero(branchId)) {
      tableDetails.branchId = branchId;
    }

    if (isNotUndefinedNullEmptyZero(branchName)) {
      tableDetails.branchName = branchName;
    }
  }
}

// function openQrPage() {
//   saveRequestPageInQr({
//     name: route.name,
//   });
//   router.push({
//     name: "table-scanner",
//   });
// }
function openScanner() {
  window.Telegram.WebApp.showScanQrPopup({}, async (d) => {
    const idxQuery = d.indexOf("?start=") + 7;
    const id = d.slice(idxQuery);
    console.log(id);
    //api.branch.fetchTable(id).then((res) => {});
    window.Telegram.WebApp.closeScanQrPopup();
  });
}
async function getTable() {
  alert(1);
  const res = await api.branch.fetchTable(
    "55b8d392-2542-4a18-a431-c38dd6fd7015"
  );
  alert(2);
  console.log(res);
}

onMounted(() => {
  initializeTableDetails();
});
</script>

<template>
  <div>
    <title-medium class="cm-b-2">QR код стола</title-medium>
    <div v-if="tableDetails.name" class="c-flex c-align-center cm-b-2 c-column-gap-1">
      <x-icon name="table_restaurant" size="24" />
      <span>{{ tableDetails.name }}</span>
    </div>
    <round-button class="c-flex c-align-center justify-content-center" @click="getTable">
      <x-icon name="qr_code_2" />
      <span class="cm-l-1"> Сканировать! </span>
    </round-button>
  </div>
</template>

<style lang="scss" scoped>
.c-address-empty-message {
  color: var(--content_3);
  min-height: 8rem;
}
</style>
