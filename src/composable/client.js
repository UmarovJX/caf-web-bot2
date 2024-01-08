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
    console.log(error);
    alert(error.request.config.url);
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
