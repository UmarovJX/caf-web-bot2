import Core from "@/services/helper/core.js";
import { combineUrls } from "@/services/helper";

class ClientService extends Core {
  constructor() {
    super();
  }

  updateClient(body) {
    return this.put(`users/me`, body);
  }

  getClient() {
    return this.get(`users/me`);
  }

  getBasketItems() {
    return this.get(`baskets`);
  }

  addItemToBasket(body) {
    return this.post(`baskets`, body);
  }

  updateItemOfBasket({ basketId } = { basketId: undefined }, body) {
    return this.put(`baskets/${basketId}`, body);
  }

  deleteItemOfBasket({ basketId } = { basketId: undefined }) {
    return this.delete(`baskets/${basketId}`);
  }

  getAllAddresses({ params } = { params: {} }) {
    return this.get(`users/addresses`, {
      params,
    });
  }

  createAddress(body) {
    return this.post(`users/addresses`, body);
  }

  getAddress(addressId) {
    return this.get(`users/addresses/${addressId}`);
  }

  getAddresses() {
    // "users/addresses?limit=50"
    return this.get(combineUrls(["users", "addresses"]), {
      params: {
        limit: 50,
      },
    });
  }

  updateAddress(addressId, body) {
    return this.put(`users/addresses/${addressId}`, body);
  }

  deleteAddress({ addressId } = { addressId: undefined }) {
    return this.delete(`users/addresses/${addressId}`);
  }

  addressPrimary({ addressId } = { addressId: undefined }) {
    return this.post(`users/addresses/${addressId}/primary`);
  }

  updateLocaleLang(lang) {
    return this.put("users/language", lang);
  }
}

export default new ClientService();
