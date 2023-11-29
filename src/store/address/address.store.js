import { defineStore } from "pinia";
import api from "@/services/api";

export const useAddressStore = defineStore("address", {
  state: async () => {
    let filterData = [];
    try {
      const { data } = await api.shop.getShopParams();
      filterData = data.result;
      console.log(filterData, "data");
    } catch (e) {
      console.error(e, "error");
    }
    let address = {
      active: false,
      deliveryType: "table",
      deliveryOptions: [
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
      ],
    };

    address.deliveryOptions = address.deliveryOptions.filter(
      (item) => filterData[item.check]
    );

    return address;
  },

  actions: {
    openDrawerHandler() {
      this.active = true;
    },

    closeDrawerHandler() {
      this.active = false;
    },

    updateDeliveryType(type) {
      this.deliveryType = type;
    },
  },
});
