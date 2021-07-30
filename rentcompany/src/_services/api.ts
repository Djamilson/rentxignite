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

  api.interceptors.response.use(
    (res) => {
      return res;
    },
    async (error: AxiosError) => {
     
      if (error.response?.status === 401) {
        if (error.response.data?.message === 'token.invalid!') {
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            try {
              const userCollection = database.get<ModelUser>('users');
              await database.action(async () => {
                const userSelected = await userCollection.query().fetch();

                api
                  .post(`refresh`, {
                    token: userSelected[0].refresh_token,
                    device,
                  })
                  .then(async (res) => {
                    try {
                      const { token, refreshToken } = res.data;

                      await userSelected[0].update((userData) => {
                        (userData.token = token),
                          (userData.refresh_token = refreshToken);
                      });

                      api.defaults.headers['Authorization'] = `Bearer ${token}`;

                      failedRequestsQueue.forEach((req) =>
                        req.onSuccess(token),
                      );
                      failedRequestsQueue = [];
                    } catch (err) {
                      failedRequestsQueue.forEach((req) => req.onFailure(err));
                      failedRequestsQueue = [];
                    } finally {
                      isRefreshing = false;
                    }
                  })
                  .catch(function (error) {
                    throw new Error(error);
                  });
              });
            } catch (err) {
              throw new Error(err);
            }
          }

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
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
