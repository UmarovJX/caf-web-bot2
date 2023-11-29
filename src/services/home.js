import Core from "@/services/helper/core.js";

class HomeService extends Core {
  constructor() {
    super();
  }

  getHomeItems() {
    return this.get(`home`);
  }
}

export default new HomeService();
