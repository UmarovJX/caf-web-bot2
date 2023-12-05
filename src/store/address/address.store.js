import api from "@/services/api";
import { ref } from "vue";
const deliveryOptions = ref([
  {
    id: 1,
    value: "table",
    check: "is_table",
    label: "За столом",
  },
  {
    id: 2,
    value: "pickup",
    check: "is_pickup",
    label: "Самовывоз",
  },
  {
    id: 3,
    value: "delivery",
    check: "is_delivery",
    label: "Доставка",
  },
]);
const active = ref(false);
const deliveryType = ref("table");
let filterData = [];
try {
  const { data } = await api.shop.getShopParams();
  filterData = data.result;
} catch (e) {
  console.error(e, "error");
}
deliveryOptions.value = deliveryOptions.value.filter(
  (item) => filterData[item.check]
);

function openDrawerHandler() {
  active.value = true;
}

function closeDrawerHandler() {
  active.value = false;
}

function updateDeliveryType(type) {
  deliveryType.value = type;
}

export const useAddressStore = function () {
  const res = {
    active,
    deliveryOptions,
    deliveryType,
    openDrawerHandler,
    closeDrawerHandler,
    updateDeliveryType,
  };
  return res;
};
