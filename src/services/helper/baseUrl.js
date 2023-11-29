import axios from "axios";
import {
  axiosResponseInterceptorError,
  axiosRequestInterceptResponse,
} from "@/services/helper/interceptors.js";

const instanceGenerator = (baseUrl) => {
  const instance = axios.create({
    baseURL: baseUrl,
  });

  instance.interceptors.request.use(axiosRequestInterceptResponse, (error) =>
    Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    axiosResponseInterceptorError
  );
  return instance;
};

export const axiosV1 = (shopId) =>
  instanceGenerator(import.meta.env.VITE_BASE_APP_URL + shopId);
export const baseUrl = import.meta.env.VITE_BASE_APP_URL;
