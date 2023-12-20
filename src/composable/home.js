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
