import Core from "@/services/helper/core.js";

class OrderService extends Core {
  constructor() {
    super();
  }

  getOrders(params) {
    return this.get("orders", { params });
  }

  orderPreview(body) {
    return this.post("orders/preview", body);
  }

  createOrder(body) {
    return this.post("orders", body);
  }
}

export default new OrderService();
