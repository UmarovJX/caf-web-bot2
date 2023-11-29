import { defineStore } from "pinia";

export const useClientStore = defineStore("client", {
  state: () => {
    return {
      client: {},
      webApp: {},
      deliveryType: "delivery",
      pickupBranch: {},
      primaryAddress: {},
      clientTable: {},
    };
  },

  getters: {
    gtrClient: (state) => state?.client,
    gtrUniqueId: (state) => state?.client?.id,
  },

  actions: {
    initializeClient({ webApp }) {
      // this.webApp = webApp;
      this.client = webApp.initDataUnsafe.user;
    },

    setPickupBranch(branch) {
      this.pickupBranch = branch;
    },

    setDeliveryType(type) {
      this.deliveryType = type;
    },

    setPrimaryAddress(address) {
      this.primaryAddress = address;
    },

    setClientBookedTable(table) {
      this.clientTable = table;
    },
  },
});
