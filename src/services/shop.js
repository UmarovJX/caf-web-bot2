import Core from "@/services/helper/core.js";
class ShopService extends Core {
  constructor() {
    super();
  }

  getShopInfo() {
    return this.get(`/`);
  }

  getShopParams() {
    return this.get(`/info`);
  }

  getHomeItems() {
    return this.get(`/home`);
  }
}

export default new ShopService();
