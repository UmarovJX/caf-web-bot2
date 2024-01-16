import { ref } from "vue";
import api from "@/services/api";

const user = ref(null);

export async function useUser() {
  if (!user.value) {
    const {
      data: { result },
    } = await api.client.getClient();
    user.value = result;
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
