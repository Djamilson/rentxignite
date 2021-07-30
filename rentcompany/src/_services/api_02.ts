import axios, { AxiosError } from 'axios';

import * as Device from 'expo-device';

import { database } from '../database';
import { User as ModelUser } from '../database/model/User';

const device = Device.modelName;

import localhostConfig from '../_config/host';
import { AuthTokenError } from './errors/AuthTokenError';

const { WEBHOST, PORT, LOCALHOST } = localhostConfig;

let baseURL = `https://${WEBHOST}`;

if (__DEV__) {
  baseURL = `http://${LOCALHOST}:${PORT}`;
}

// depois só remover essa linha
//baseURL = `https://www.ofertadodia.palmas.br/gostack`;
baseURL = `http://${LOCALHOST}:${PORT}`;

let isRefreshing = false;
let failedRequestsQueue: any[] = [];

export function setupAPIClient() {
  const api = axios.create({
    baseURL,
  });

  const handleTokenRefresh = async () => {
    const userCollection = database.get<ModelUser>('users');
    let userSelected = [] as ModelUser[];

    await database.action(async () => {
      userSelected = await userCollection.query().fetch();
    });

    return new Promise((resolve, reject) => {
      api
        .post(`refresh`, {
          token: userSelected[0].refresh_token,
          device,
        })
        .then(async (res) => {
          const { token, refreshToken } = res.data;

          await userSelected[0].update((userData) => {
            (userData.token = token), (userData.refresh_token = refreshToken);
          });

          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          api.defaults.headers['Authorization'] = `Bearer ${token}`;

          failedRequestsQueue.forEach((req) => req.onSuccess(token));
          failedRequestsQueue = [];

          resolve(token);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  api.interceptors.response.use(
    (res) => {
      return res;
    },
    async (error) => {
      console.log('=>>ei: 01', error.response.data);
      console.log('=>>ei: 02', error.response.status);

      console.log('=>>ei: 03', error.config);
      console.log('=>>ei: error.config.retry', error._retry);

      if (error.response?.status === 401) {
        if (error.response.data?.message === 'token.invalid!') {
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;
            const newAccessToken = handleTokenRefresh();
            console.log('newAccessToken', newAccessToken);
            originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;

            return axios(originalConfig);
          }

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                console.log('Token', token);
                originalConfig.headers['Authorization'] = `Bearer ${token}`;

                resolve(api(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        } else {
          return Promise.reject(new AuthTokenError());
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
}
