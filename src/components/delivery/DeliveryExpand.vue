<script setup>
import AppDrawer from "@/components/elements/drawer/AppDrawer.vue";
import TitleMedium from "@/components/reusable/title/TitleMedium.vue";

import ChooseAddress from "@/components/delivery/elements/ChooseAddress.vue";
import ChoosePickup from "@/components/delivery/elements/ChoosePickup.vue";
import ChooseTable from "@/components/delivery/elements/ChooseTable.vue";

import { useAddressStore } from "@/store/address/address.store";
import { computed, defineEmits, onMounted, reactive, watch } from "vue";
import { mainButtonMakeDisable } from "@/util/main.button.util";
import shop from "@/services/shop";
import {
  hasAddressSession,
  hasPickupBranchSession,
  hasTableSession,
} from "@/util/address.util";

const emits = defineEmits(["apply-delivery", "select"]);

const addressStore = useAddressStore();
const appElement = document.getElementById("app");
const appBody = document.getElementById("app-body");

const permissionOfTypes = reactive({
  is_table: false,
  is_delivery: false,
  is_pickup: false,
});

const deliveryOptions = computed(() => {
  return addressStore.deliveryOptions.filter((d) => {
    return permissionOfTypes["is_" + d.value];
  });
});

const bottomComponent = computed(() => {
  switch (addressStore.deliveryType) {
    case "delivery": {
      return ChooseAddress;
    }
    case "pickup": {
      return ChoosePickup;
    }
    case "table": {
      return ChooseTable;
    }
  }

  return null;
});

watch(
  () => addressStore.deliveryType,
  () => {
    validate();
  },
  {
    immediate: true,
  }
);

watch(
  () => addressStore.active,
  (a) => {
    if (a) {
      validate();
    }
    changeBodyStyle();
  },
  {
    immediate: true,
  }
);

function validate() {
  const isSatisfy =
    (addressStore.deliveryType === "table" && hasTableSession()) ||
    (addressStore.deliveryType === "delivery" && hasAddressSession()) ||
    (addressStore.deliveryType === "pickup" && hasPickupBranchSession());

  if (isSatisfy) {
    emits("select");
  } else {
    mainButtonMakeDisable();
  }
}

function changeBodyStyle() {
  if (addressStore.active) {
    appElement.style.overflowY = "hidden";
    appElement.style.height = "100vh";
    appBody.style.overflowY = "hidden";
    appBody.style.height = "100vh";
  } else {
    appElement.style.overflowY = "auto";
    appElement.style.height = "";
    appBody.style.overflowY = "auto";
    appBody.style.height = "";
  }
}

async function fetchPaymentInfo() {
  const {
    data: {
      result: { is_pickup, is_table, is_delivery },
    },
  } = await shop.getShopParams();

  permissionOfTypes.is_pickup = is_pickup;
  permissionOfTypes.is_table = is_table;
  permissionOfTypes.is_delivery = is_delivery;

  if (is_delivery) {
    addressStore.updateDeliveryType("delivery");
  } else if (is_table) {
    addressStore.updateDeliveryType("table");
  } else if (is_pickup) {
    addressStore.updateDeliveryType("pickup");
  } else {
    addressStore.updateDeliveryType(null);
  }
}

onMounted(() => {
  if (addressStore.active) {
    validate();
  }
});

fetchPaymentInfo();
</script>

<template>
  <app-drawer :show="addressStore.active">
    <template #body>
      <title-medium class="c-delivery-title cp-1">
        Выберите способ получения
      </title-medium>

      <div class="c-delivery-main-content">
        <div class="c-delivery-header cp-1">
          <span
            v-for="deliveryOption in deliveryOptions"
            :key="deliveryOption.id"
          >
            <!--            cm-b-2-->
            <label :for="deliveryOption.value" class="container b-large">
              <title-medium class="cm-l-1">
                {{ deliveryOption.label }}
              </title-medium>
              <input
                :id="deliveryOption.value"
                v-model="addressStore.deliveryType"
                :value="deliveryOption.value"
                name="option"
                type="radio"
              />
              <span class="checkmark"></span>
            </label>
          </span>
        </div>

        <div class="c-delivery-bottom-content cp-1">
          <component :is="bottomComponent" @select="$emit('select')" />
        </div>
      </div>
    </template>
  </app-drawer>
</template>

<style lang="scss" scoped>
.c-delivery-title,
.c-delivery-header,
.c-delivery-bottom-content {
  background-color: var(--background_primary);
  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.06));
}

.c-delivery-header {
  display: flex;
  flex-direction: column;
}

.c-delivery-bottom-content {
  margin-top: 12px;
}

.c-delivery-main-content {
  max-height: 75vh;
  overflow-y: scroll;
}
</style>
