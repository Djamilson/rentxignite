import axios from 'axios';

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

let failedQueue: any[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export function setupAPIClient() {
  const api = axios.create({
    baseURL,
  });

  api.interceptors.response.use(
    (res) => {
      return res;
    },
    async (error) => {
      //console.log('Erro na api: error.isAxiosError', error.isAxiosError);

     // console.log('Erro na api: 03 error.stack', error.stack);

     // console.log('Erro na api:', error.name);

      const originalRequest = error.config;

      if (error.response.status === 500 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return api.request(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;
        let refresh_token: string;
        let userSelected: ModelUser[];

        try {
          const userCollection = database.get<ModelUser>('users');

          await database.action(async () => {
            userSelected = await userCollection.query().fetch();
            refresh_token = userSelected[0].refresh_token;
          });
        } catch (err) {}

        return new Promise((resolve, reject) => {
          api
            .post(`refresh`, {
              token: refresh_token,
              device,
            })
            .then(async (res: any) => {
              const { token, refreshToken } = res.data;

              await userSelected[0].update((userData) => {
                (userData.token = token),
                (userData.refresh_token = refreshToken);
              });

              api.defaults.headers['Authorization'] = `Bearer ${token}`;

              processQueue(null, token);
              resolve(api(originalRequest));
            })
            .catch((err: any) => {
              processQueue(err, null);
              reject(err);
            })
            .then(() => {
              isRefreshing = false;
            });
        });
      }

      return Promise.reject(error);
    },
  );

  return api;
}
