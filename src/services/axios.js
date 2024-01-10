import axios from "axios";
import { useRouter } from "vue-router";
const instance = axios.create({
  baseURL:
    import.meta.env.VITE_BASE_APP_URL + import.meta.env.VITE_BASE_SHOP_ID,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (r) => r,
  function (error) {
    if (error.status === 401) {
      useRouter().push({ name: "signin" });
    }
    return Promise.reject({ msg: error.response.data.message }); //{ R: 'E', msg: response.response.data }
  }
);

export default instance;
