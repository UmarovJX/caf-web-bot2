import { ref } from "vue";
import api from "@/services/api";
const {
  data: { result },
} = await api.client.getClient();
const user = ref(result);

export function useUser() {
  return {
    user,
  };
}
