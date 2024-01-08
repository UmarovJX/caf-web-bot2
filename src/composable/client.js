import { ref } from "vue";
import api from "@/services/api";

const user = ref(null);

export async function useUser() {
  try {
    if (!user.value) {
      const {
        data: { result },
      } = await api.client.getClient();
      user.value = result;
    }
  } catch (error) {
    const c = error.config;
    alert(error.message);
    alert(Object.keys(error));
    alert(c.baseURL + c.url + "-" + c.data);
  }
  return {
    user,
  };
}

export async function reFetchClient() {
  const {
    data: { result },
  } = await api.client.getClient();
  user.value = result;
}
