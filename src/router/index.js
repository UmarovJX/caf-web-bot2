import { createRouter, createWebHistory } from "vue-router";
import DeliveryView from "../views/delivery/DeliveryView.vue";
import ProductView from "../views/product/ProductView.vue";
import CartView from "@/views/cart/CartView.vue";
import AccountView from "@/views/account/AccountView.vue";
import AccountEditView from "@/views/account/AccountEditView.vue";
import FavoritesView from "@/views/favorites/FavoritesView.vue";
import CashbackView from "@/views/cashback/CashbackView.vue";
import PaymentView from "@/views/payment/PaymentView.vue";
import AddressView from "@/views/address/AddressView.vue";
import AddressMapView from "@/views/address/AddressMapView.vue";
import AccountLanguage from "@/views/account/language/AccountLanguage.vue";
import OrdersView from "@/views/orders/OrdersView.vue";
import TableScanner from "@/views/scanner/ScannerView.vue";
import PickupView from "@/views/pickup/PickupView.vue";
import AddressSelect from "@/views/address/AddressSelect.vue";
import CheckoutAddress from "@/views/address/CheckoutAddress.vue";
import { enableAppScroll } from "@/util/app.util";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "delivery-view",
      component: DeliveryView,
    },
    {
      path: "/product/:id/view",
      name: "product-view",
      component: ProductView,
    },
    {
      path: "/cart",
      name: "cart-view",
      component: CartView,
    },
    {
      path: "/account",
      name: "account-view",
      component: AccountView,
    },
    {
      path: "/account/language",
      name: "account-language",
      component: AccountLanguage,
    },
    {
      path: "/account/edit",
      name: "account-edit",
      component: AccountEditView,
    },
    {
      path: "/favorites",
      name: "favorites-view",
      component: FavoritesView,
    },
    {
      path: "/cashback",
      name: "cashback-view",
      component: CashbackView,
    },
    {
      path: "/payment",
      name: "payment-view",
      component: PaymentView,
    },
    {
      path: "/addresses",
      name: "address-view",
      component: AddressView,
    },
    {
      path: "/client/a/create",
      name: "address-create",
      component: AddressMapView,
    },
    {
      path: "/client/a/edit/:id",
      name: "address-edit",
      component: AddressMapView,
    },
    {
      path: "/checkout/address/create",
      name: "checkout-address-create",
      component: CheckoutAddress,
    },
    {
      path: "/orders",
      name: "orders-view",
      component: OrdersView,
    },
    {
      path: "/scanner",
      name: "table-scanner",
      component: TableScanner,
    },
    {
      path: "/pickup",
      name: "pickup-view",
      component: PickupView,
    },
    {
      path: "/client/address/select",
      name: "address-select",
      component: AddressSelect,
    },
  ],
});

router.beforeEach(() => {
  enableAppScroll();
});

export default router;
