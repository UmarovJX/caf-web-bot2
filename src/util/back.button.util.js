import { hasOwnProperty } from "@/util/object";
import {
  getRequestPageInCreateAddress,
  getRequestPageInQr,
} from "@/util/address.util";

export class HandleBackButton {
  constructor(router, route) {
    this.router = router;
    this.route = route;
  }

  async binding() {
    switch (this.route.name) {
      case "orders-view": {
        await this.ordersViewPageEvent();
        break;
      }
      case "table-scanner": {
        await this.tableScannerEvent();
        break;
      }
      case "pickup-view": {
        await this.pickupEvent();
        break;
      }
      case "address-select": {
        await this.addressSelectEvent();
        break;
      }
      case "address-view": {
        await this.openAccountView();
        break;
      }
      case "address-create": {
        await this.openAccountView();
        break;
      }
      case "checkout-address-create": {
        const redirectPage = getRequestPageInCreateAddress();
        if (redirectPage) {
          await this.router.push({
            name: redirectPage,
          });
        } else {
          await this.router.push({
            name: "delivery-view",
          });
        }
        // await this.checkoutAddressCreateEvent();
        break;
      }
      case "account-view": {
        await this.openHomeView();
        break;
      }
      default: {
        this.router.go(-1);
      }
    }
  }

  async push(name = "delivery-view", params = {}, query = {}) {
    await this.router.push({
      name,
      params,
      query,
    });
  }

  async openPaymentViewByQuery() {
    // console.log("openPaymentViewByQuery");
    await this.push("payment-view", {}, this.route.query);
  }

  async openAccountView() {
    await this.push("account-view");
  }

  async openHomeView() {
    await this.push("delivery-view");
  }

  async ordersViewPageEvent() {
    if (hasOwnProperty(this.route.query, "done")) {
      await this.push("delivery-view");
    } else {
      await this.openAccountView();
    }
  }

  async tableScannerEvent() {
    if (getRequestPageInQr() === "payment-view") {
      await this.openPaymentViewByQuery();
    } else {
      await this.openHomeView();
    }
  }

  async pickupEvent() {
    if (getRequestPageInQr() === "payment-view") {
      await this.openPaymentViewByQuery();
    } else {
      await this.openHomeView();
    }
  }

  async addressSelectEvent() {
    await this.openPaymentViewByQuery();
  }

  async checkoutAddressCreateEvent() {
    await this.push("address-select", {}, this.route.query);
  }
}
