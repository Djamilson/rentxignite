import axios, { AxiosError } from 'axios';

import * as Device from 'expo-device';

import { database } from '../database';
import { User as ModelUser } from '../database/model/User';

const device = Device.modelName;

import localhostConfig from '../_config/host';

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
    (response) => {
      return response;
    },
    (error) => {
      return new Promise(async (resolve, reject) => {
        const originalReq = error.config;

        console.log('01: here ', error.response.status);

        if (
          error.response.status === 500 &&
          error.config &&
          !error.config.__isRetryRequest
        ) {
          originalReq._retry = true;

          const userCollection = database.get<ModelUser>('users');
          let userSelected = [] as ModelUser[];

          await database.action(async () => {
            userSelected = await userCollection.query().fetch();
          });

          let res = api
            .post(`refresh`, {
              token: userSelected[0].refresh_token,
              device,
            })
            .then(async (res) => {
              console.log('Consegui o retorno do banco', res);
              const { token, refreshToken } = res.data;
              console.log('Consegui o retorno do banco', token, refreshToken);

              await userSelected[0].update((userData) => {
                (userData.token = token),
                  (userData.refresh_token = refreshToken);
              });

              return token;
            })
            .then((token) => {
              console.log('token:::', token);

              api.defaults.headers['Authorization'] = `Bearer ${token}`;

              failedRequestsQueue.forEach((req) => req.onSuccess(token));
              failedRequestsQueue = [];
              return api(originalReq);
            });

          resolve(res);
        } else {
          console.log('token::: error::', error);
          return reject(error);
        }
      });
    },
  );

  return api;
}
