import React, { createContext, useState, useContext, ReactNode } from 'react';
import { api } from '../_services/apiClient';
import { database } from '../database';
import { User as ModelUser } from '../database/model/User';

import { useEffect } from 'react';
import * as Device from 'expo-device';

interface User {
  id: string;
  user_id: string;
  person_id: string;
  person_name: string;
  person_email: string;
  person_driver_license: string;
  person_status: boolean;
  person_privacy: boolean;
  person_avatar: string;
  person_avatar_url: string;

  refreshToken: string;
  token: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContexData {
  user: User;
  signIn: (credentials: SignInCredentials) => Promise<any>;
  signOut: () => void;
  updateUser: (user: User) => void;
  loading: boolean;
}

const AuthContex = createContext<AuthContexData>({} as AuthContexData);

interface AuthProviderProps {
  children: ReactNode;
}
function AuthProvider({ children }: AuthProviderProps) {
  const [data, setData] = useState<User>({} as User);
  const [loading, setLoading] = useState<boolean>(true);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const device = Device.modelName;

      await api
        .post('sessions', {
          email,
          password,
          device,
        })
        .then((res) => {
          const { user, token, refreshToken } = res.data;

          api.defaults.headers.authorization = `Bearer ${token}`;

          const userCollection = database.get<ModelUser>('users');

          database.action(async () => {
            await userCollection
              .create((newUser) => {
                newUser.user_id = user.id;
                newUser.person_id = user.person.id;
                newUser.person_name = user.person.name;
                newUser.person_email = user.person.email;
                newUser.person_driver_license = user.person.driver_license;
                newUser.person_avatar = user.person.avatar;

                newUser.person_status = user.person.status;
                newUser.person_privacy = user.person.privacy;
                newUser.person_avatar = user.person.avatar;
                newUser.person_avatar_url = user.person.avatar_url;

                newUser.token = token;
                newUser.refresh_token = refreshToken;
              })
              .then((res) => {
                if (res) {
                  setData(res as unknown as User);
                }
              })
              .catch(function (error) {
                throw new Error(error);
              });
          });
        })
        .catch(function (error) {
          throw new Error(error);
        });
    } catch (error) {
      throw new Error(error);
    }
  }

  async function signOut() {
    try {
      const userCollection = database.get<ModelUser>('users');

      await database.action(async () => {
        const userSelected = await userCollection.find(data.id);
        await userSelected.destroyPermanently();
      });

      setData({} as User);
    } catch (err) {
      throw new Error(err);
    }
  }

  async function updateUser(user: User) {
    try {
      const userCollection = database.get<ModelUser>('users');
      await database.action(async () => {
        const userSelected = await userCollection.find(user.id);

        await userSelected.update((userData) => {
          (userData.person_name = user.person_name),
            (userData.person_driver_license = user.person_driver_license),
            (userData.person_avatar = user.person_avatar),
            (userData.person_avatar_url = user.person_avatar_url);
        });
      });

      setData({ ...data, ...user });
    } catch (err) {
      throw new Error(err);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadUserData(): Promise<void> {
      try {
        const userCollection = database.get<ModelUser>('users');

        const response = await userCollection.query().fetch();

        if (isMounted && response.length > 0) {
          const userData = response[0]._raw as unknown as User;
          api.defaults.headers.authorization = `Bearer ${userData.token}`;

          setData(userData);
          setLoading(false);
        }
      } catch {
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUserData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContex.Provider
      value={{ user: data, loading, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContex.Provider>
  );
}

function useAuth(): AuthContexData {
  const context = useContext(AuthContex);

  if (!context) {
    throw new Error('useAuth mus be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
