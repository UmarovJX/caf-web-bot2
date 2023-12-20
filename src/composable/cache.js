import api from "@/services/api";

let homeInfo = null;
export async function useHomeInfo() {
  if (!homeInfo) {
    const {
      data: { result },
    } = await api.home.getHomeItems();
    homeInfo = result;
  }
  return homeInfo;
}
let mainInfo = null;
export async function useMainInfo() {
  if (!mainInfo) {
    mainInfo = await api.shop.getShopParams();
  }
  return mainInfo;
}
let shopInfo = null;
export async function useShopInfo() {
  if (!shopInfo) {
    shopInfo = await api.shop.getShopInfo();
  }
  return shopInfo;
}
