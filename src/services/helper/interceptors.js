import axios from "axios";
import api from "@/services/api";
import { getLocalVar, setLocalVar } from "@/util/localstorage.util";
import { TELEGRAM, WEB_APP } from "@/constants";

export function axiosRequestInterceptResponse(config) {
  const lang = localStorage.getItem("locale");
  const access_token = getLocalVar("access_token");
  const requestConfig = Object.assign({}, config);
  if (!config.headers["Authorization"] && config.url !== "oauth/login") {
    requestConfig.headers["Authorization"] = `Bearer ${access_token}`;
  }

  requestConfig.headers["Accept-Language"] = lang || "ru";

  return requestConfig;
}

export async function axiosResponseInterceptorError(error) {
  if (error.response) {
    const { status } = error.response;
    const { config } = error;
    switch (status) {
      case 401: {
        if (error.config.url.split("/")[0] === "login") {
          return Promise.reject(error);
        }
        const clientId = window[TELEGRAM][WEB_APP].initDataUnsafe?.user?.id;
        return await api.auth.signIn(clientId).then(async (response) => {
          const { result } = await response.data;
          setLocalVar("access_token", result["access_token"]);
          const _axios = axios.create({
            baseURL: error.config.baseURL,
            headers: {
              Authorization: `Bearer ${result["access_token"]}`,
            },
          });
          const data = () => {
            if (config.data) return JSON.parse(config.data);
            return config.data;
          };

          return await _axios({
            method: config.method,
            url: config.url,
            data: data(),
            params: config.params,
          })
            .then((response) => response)
            .catch((error) => Promise.reject(error));
        });
      }
      default:
        return Promise.reject(error);
    }
  }

  return Promise.reject(error);
}
