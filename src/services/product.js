import Core from "@/services/helper/core.js";
import { combineUrls } from "@/services/helper";

class ProductService extends Core {
  constructor() {
    super();
  }

  fetchProductItems({ productId } = { productId: undefined }) {
    return this.get(combineUrls(["products", productId]));
  }

  fetchAttributeDetails(productId, { attributes }) {
    return this.post(combineUrls(["products", productId, "attributes"]), {
      attributes,
    });
  }

  setFavorite(productId) {
    return this.get(`products/${productId}/favorite`);
  }
  fetchFavorites() {
    return this.get(`favorites`);
  }

  fetchCashbackBalance() {
    return this.get("users/cashback/balance");
  }

  fetchCashback() {
    return this.get("users/cashback");
  }
}

export default new ProductService();
