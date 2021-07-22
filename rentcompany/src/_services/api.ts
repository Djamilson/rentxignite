import axios from 'axios';

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

export function setupAPIClient() {
  const api = axios.create({
    baseURL,
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (err) => {
      return new Promise(async (resolve, reject) => {
        const originalReq = err.config;
        if (err.response.status === 401 && err.config && !err.config._retry) {
          originalReq._retry = true;

          try {
            const userCollection = database.get<ModelUser>('users');
            await database.action(async () => {
              const userSelected = await userCollection.query().fetch();

              await api
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

                    originalReq.headers['Authorization'] = `Bearer ${token}`;

                    return api(originalReq);
                  } catch (err) {
                    throw new Error(err);
                  }
                });
            });
          } catch (err) {
            throw new Error(err);
          }
        } else {
          reject(err);
        }
      });
    },
  );

  return api;
}
