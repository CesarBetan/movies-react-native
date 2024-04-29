import axios from 'axios';
import {API_URL} from '../config/environment';
import {IHandlerError, IHandlerSuccess} from './types';

const instance = axios.create({
  baseURL: API_URL,
});

class CustomError extends Error {
  constructor(message, data, status) {
    super(message);
    this.data = data;
    this.status = status;
  }
}

export const handleError = (error: IHandlerError) => {
  const message = error?.message ?? null;
  const data = error?.response?.data ?? null;
  const status = error?.response?.status ?? null;
  throw new CustomError(message, data, status);
};

export const handleSuccess = (result: IHandlerSuccess) => {
  if (result && result.data && result.status >= 200 && result.status < 400) {
    return result.data.data || result.data;
  }
  return result;
};

instance.interceptors.response.use(
  response => response,
  error => handleError(error),
);

const tokenInterceptor = async (config: any) => {
  const newConfig = {...config};
  // newConfig.headers.Authorization = `Bearer token if used`;
  return newConfig;
};

instance.interceptors.request.use(tokenInterceptor);

export default instance;
