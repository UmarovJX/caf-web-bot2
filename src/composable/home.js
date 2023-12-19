import { ref } from "vue";
import api from "@/services/api";

const homeInfo = ref(null);
export async function useHomeInfo() {
  if (!homeInfo.value) {
    const {
      data: { result },
    } = await api.home.getHomeItems();
    homeInfo.value = result;
  }
  return homeInfo.value;
}
