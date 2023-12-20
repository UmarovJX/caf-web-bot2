<script setup>
import { onMounted, ref, watch } from "vue";
// import router from "@/router";
import api from "@/services/api";
// import { formatToPrice } from "@/util/formatter";
import { useClientStore } from "@/store/client/client.store";

// import VueElementLoading from "vue-element-loading";
import AddressPicker from "@/components/delivery/AddressPicker.vue";
import XIcon from "@/components/elements/material-icons/XIcon.vue";
import { TELEGRAM, WEB_APP } from "@/constants";
import { useMainInfo } from "@/composable/cache";
// const isActive = ref(false);
const client = useClientStore();

const nearestBranches = ref({
  list: [],
  isFetching: false,
});

const addresses = ref({
  list: [],
  isFetching: false,
});

// let checkedAddressValue = ref(null);

async function fetchClientAddresses() {
  addresses.value.isFetching = true;

  try {
    const {
      data: { result },
    } = await api.client.getAllAddresses({
      limit: 20,
    });
    addresses.value = result;
  } finally {
    addresses.value.isFetching = false;
  }
}

let options = [
  {
    id: 1,
    value: "table",
    check: "is_table",
    text: "За столом",
  },
  {
    id: 2,
    value: "pickup",
    check: "is_pickup",
    text: "Самовывоз",
  },
  {
    id: 3,
    value: "delivery",
    check: "is_delivery",
    text: "Доставка",
  },
];

async function checkOptions() {
  try {
    const { data } = await useMainInfo();
    options = options.filter((item) => data.result[item.check]);
  } catch (e) {
    console.error(e, "error");
  }
}

let checkedValue = ref(null);
let checkedPickupValue = ref({});
checkedValue.value = options[0];

watch(
  checkedPickupValue,
  (ltsValue) => {
    client.setDeliveryType("pickup");
    client.setPickupBranch(ltsValue);
  },
  {
    deep: true,
  }
);

// const toggleActive = () => {
//   return (isActive.value = !isActive.value);
// };

watch(checkedValue, (ltsValue) => {
  if (ltsValue.value === "pickup") {
    getPermissionToLocation();
  }

  if (ltsValue.value === "delivery") {
    fetchClientAddresses();
  }
});

function getLocation() {
  nearestBranches.value.isFetching = true;
  return new Promise((resolve, reject) => {
    const success = (position) => resolve(position);
    const error = (error) => reject(error);
    navigator.geolocation.getCurrentPosition(success, error);
  });
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

onMounted(async () => {
  await checkOptions();
});

const webApp = window[TELEGRAM][WEB_APP];
webApp.ready();
// let scanEvent = ref(null);
// let scanType = ref(null);
// let scanEvent = ref(null);
// let scanType = ref();
</script>

<template>
  <div
    style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 1rem;
      padding-top: 1rem;
      padding-right: 1rem;
      margin-left: 1rem;
      margin-bottom: 1rem;
    "
  >
    <address-picker />

    <router-link :to="{ name: 'cart-view' }" class="header-icon">
      <x-icon
        color="var(--brown)"
        name="shopping_cart"
        size="18"
        style="margin-right: 10px"
      />
    </router-link>
    <router-link :to="{ name: 'account-view' }" class="header-icon">
      <x-icon color="var(--brown)" name="person" size="18" />
    </router-link>
  </div>
  <!--  <div-->
  <!--    :style="checkedValue.value === 'pickup' ? 'padding: .75rem 1rem' : ''"-->
  <!--    class="header"-->
  <!--  >-->
  <!--    &lt;!&ndash;    <div>&ndash;&gt;-->
  <!--    &lt;!&ndash;      {{ scanEvent }}&ndash;&gt;-->
  <!--    &lt;!&ndash;    </div>&ndash;&gt;-->

  <!--    <div class="header-block">-->
  <!--      <div-->
  <!--        :class="isActive ? 'active' : ''"-->
  <!--        class="header-dropdown d-flex align-items-center"-->
  <!--        @click="toggleActive"-->
  <!--      >-->
  <!--        <div class="d-flex flex-column justify-content-center">-->
  <!--          <p-->
  <!--            :class="{ 't-medium': checkedValue.value === 'pickup' }"-->
  <!--            class="t-large"-->
  <!--          >-->
  <!--            {{ checkedValue.text }}-->
  <!--          </p>-->

  <!--          <p-->
  <!--            v-if="checkedPickupValue && checkedValue.value === 'pickup'"-->
  <!--            class="b-small"-->
  <!--          >-->
  <!--            {{ checkedPickupValue["title"] }}-->
  <!--          </p>-->
  <!--        </div>-->

  <!--        <div-->
  <!--          class="dropdown-icon d-flex align-items-center justify-content-center"-->
  <!--        >-->
  <!--          <x-icon-->
  <!--            v-if="isActive"-->
  <!--            color="var(&#45;&#45;brown)"-->
  <!--            name="expand_less"-->
  <!--            size="24"-->
  <!--          />-->
  <!--          <x-icon v-else color="var(&#45;&#45;brown)" name="expand_more" size="24" />-->
  <!--        </div>-->
  <!--      </div>-->

  <!--      <router-link :to="{ name: 'account-view' }" class="header-icon">-->
  <!--        <x-icon color="var(&#45;&#45;brown)" name="person" size="18" />-->
  <!--      </router-link>-->
  <!--    </div>-->

  <!--    <div v-if="isActive" class="header-body">-->
  <!--      <div class="custom-container">-->
  <!--        <div class="header-body_block">-->
  <!--          <label-->
  <!--            v-for="option in options"-->
  <!--            :key="option.id"-->
  <!--            :for="option.id"-->
  <!--            class="container b-large"-->
  <!--            >{{ option.text }}-->
  <!--            <input-->
  <!--              :id="option.id"-->
  <!--              v-model="checkedValue"-->
  <!--              :value="option"-->
  <!--              name="option"-->
  <!--              type="radio"-->
  <!--            />-->
  <!--            <span class="checkmark"></span>-->
  <!--          </label>-->
  <!--        </div>-->
  <!--      </div>-->

  <!--      <div v-if="checkedValue.value === 'delivery'" class="header-body_content">-->
  <!--        <div class="custom-container">-->
  <!--          <div>-->
  <!--            <h3 class="l-large pickup-title">Мои адреса</h3>-->

  <!--            <div class="header-body_block">-->
  <!--              <vue-element-loading-->
  <!--                :active="addresses.isFetching"-->
  <!--                background-color="transparent"-->
  <!--                color="#683724"-->
  <!--              />-->
  <!--              <label-->
  <!--                v-for="direct in addresses.list"-->
  <!--                :key="direct.id"-->
  <!--                :for="direct.id"-->
  <!--                class="container container-2 b-larg e"-->
  <!--              >-->
  <!--                <span class="pickup-option_title">{{ direct.address }}</span>-->
  <!--                <input-->
  <!--                  :id="direct.id"-->
  <!--                  v-model="checkedAddressValue.id"-->
  <!--                  :value="direct.id"-->
  <!--                  name="pickup-option"-->
  <!--                  type="radio"-->
  <!--                />-->
  <!--                <span class="checkmark checkmark-2"></span>-->
  <!--              </label>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->

  <!--      <div v-else class="header-body_content">-->
  <!--        <div class="custom-container">-->
  <!--          <div v-if="checkedValue.value === 'table'">-->
  <!--            <p class="l-large stol-title">QR код стола</p>-->
  <!--            <button class="stol-btn" @click="openScanPage">-->
  <!--              <x-icon color="var(&#45;&#45;brown)" name="qr_code_2" size="18" />-->
  <!--              <span class="l-large stol-btn_text">Сканировать</span>-->
  <!--            </button>-->

  <!--            <div>-->
  <!--              {{ scanEvent }}-->
  <!--            </div>-->
  <!--          </div>-->

  <!--          <div v-else-if="checkedValue.value === 'pickup'">-->
  <!--            <h3 class="l-large pickup-title">Ближайшие адреса</h3>-->

  <!--            <div class="header-body_block">-->
  <!--              <vue-element-loading-->
  <!--                :active="nearestBranches.isFetching"-->
  <!--                background-color="transparent"-->
  <!--                color="#683724"-->
  <!--              />-->
  <!--              <label-->
  <!--                v-for="branch in nearestBranches.list"-->
  <!--                :key="branch.id"-->
  <!--                :for="branch.id"-->
  <!--                class="container container-2 b-larg e"-->
  <!--              >-->
  <!--                <span class="pickup-option_title">{{ branch.address }}</span>-->
  <!--                <span class="pickup-option_distance"-->
  <!--                  >{{ formatToPrice(branch.distance) }} M от вас</span-->
  <!--                >-->
  <!--                <input-->
  <!--                  :id="branch.id"-->
  <!--                  v-model="checkedPickupValue"-->
  <!--                  :value="branch"-->
  <!--                  name="pickup-option"-->
  <!--                  type="radio"-->
  <!--                />-->
  <!--                <span class="checkmark checkmark-2"></span>-->
  <!--              </label>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<style lang="scss" scoped>
.header {
  //padding: 1rem 0;
  background-color: var(--background_primary);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 123;
  width: 100%;

  &-block {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & .dropdown-icon span {
      margin-left: 1rem;
    }
  }

  &-icon {
    width: 32px;
    height: 32px;
    border: 1px solid var(--brown);
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--orange-background);
  }

  &-body {
    position: fixed;
    top: 64px;
    left: 0;
    z-index: 100;
    background-color: var(--background_primary);
    width: 100%;

    &_block {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 0.5rem 0;
      min-height: 4rem;
    }

    &_content {
      padding: 0.5rem 0;
      border-top: 12px solid var(--background_secondary);

      & .pickup {
        &-title {
          color: var(--brown);
          margin-bottom: 1.5rem;
        }

        &-option_title {
          display: block;
        }

        &-option_distance {
          display: block;
        }
      }

      & .stol-title {
        margin-bottom: 1rem;
      }

      & .stol-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 40px;
        border-radius: 100px;
        border: 1px solid var(--content_3);
        background-color: var(--background_primary);
        margin-bottom: 0.5rem;

        &_text {
          margin-left: 0.5rem;
          color: var(--brown);
        }
      }
    }
  }
}

.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 1rem;
  cursor: pointer;
  color: var(--content_2);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.container-2 {
  margin-bottom: 2rem;
}

/* Hide the browser's default radio button */
.container input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom radio button */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  width: 24px;
  background-color: transparent;
  border: 1px solid var(--content_3);
  border-radius: 50%;
}

.checkmark-2 {
  top: 50%;
  transform: translateY(-50%);
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the radio button is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: transparent;
  border: 2px solid var(--brown);
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.container .checkmark:after {
  top: 4px;
  left: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--brown);
}
</style>
