import { axiosV1 } from "@/services/helper/baseUrl";

class Core {
  constructor(axios = axiosV1(import.meta.env.VITE_BASE_SHOP_ID)) {
    this._axios = axios;
  }

  get(url, config) {
    return this._axios.get(url, config).catch((error) => Promise.reject(error));
  }

  post(url, body = {}, config) {
    return this._axios
      .post(url, body, {
        ...config,
      })
      .catch((error) => Promise.reject(error));
  }

  put(url, body = {}) {
    return this._axios.put(url, body).catch((error) => Promise.reject(error));
  }

  delete(url) {
    return this._axios.delete(url).catch((error) => Promise.reject(error));
  }

  urls(urls) {
    return urls.reduce((r, u) => r + "/" + u, "");
  }
}

export default Core;
