import Core from "@/services/helper/core.js";
import { combineUrls } from "@/services/helper";

class BasketService extends Core {
  constructor() {
    super();
  }

  saveProductToBasket({ productId, count }) {
    return this.post("baskets", {
      count,
      product_id: productId,
    });
  }

  updateProductFromBasket(basketId, { productId, count }) {
    return this.post(combineUrls(["baskets", basketId]), {
      count,
      product_id: productId,
    });
  }

  removeProductFromBasket(basketId) {
    return this.delete(combineUrls(["baskets", basketId]));
  }

  fetchBasketProducts() {
    return this.get("baskets");
  }
}

export default new BasketService();
