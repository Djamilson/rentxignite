import React, { useState, useEffect } from 'react';

import { StatusBar, Animated } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';

import Logo from '../../assets/logo.svg';
import { Car } from '../../components/Car';
import { LoadAnimation } from '../../components/LoadAnimation';
import { useNetInfo } from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync';

import { api } from '../../_services/apiClient';
import { database } from '../../database';
import { Car as ModelCar } from '../../database/model/Car';

import { Container, Header, HeaderContent, TotalCars, CarList } from './styles';

const SPACING = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3.8;

export function Home() {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const netInfo = useNetInfo();

  function handleCarDetails(car: ModelCar) {
    navigation.navigate('CarDetails', { car });
  }

  const [cars, setCars] = useState<ModelCar[]>([] as ModelCar[]);
  const [loading, setLoading] = useState(true);
  const [flagUpdateCars, setFlagUpdateCars] = useState(0);

  async function offLineSynchronize() {
    const carCollection = database.get<ModelCar>('cars');

    await carCollection
      .query()
      .fetch()
      .then((item) => {
        return item?.map((item: any) => {
          return {
            id: item.id,
            updated_at_: item._raw.updated_at_,
          };
        });
      })
      .then(async (res) => {
        await synchronize({
          database,
          pullChanges: async ({}) => {
            try {
              const { data } = await api.get(`cars/sync/pull`, {
                params: { rentals: JSON.stringify(res) },
              });

              const { changes, latestVersion } = data;
              return { changes, timestamp: latestVersion };
            } catch (error) {
              throw new Error(error);
            }
          },
          pushChanges: async ({ changes }) => {
            try {
              const userMe = changes.users;

              if (userMe?.updated.length > 0) {
                const user = {
                  user_id: userMe.updated[0].user_id,
                  name: userMe.updated[0].person_name,
                  driver_license: userMe.updated[0].person_driver_license,
                  avatar: userMe.updated[0].person_avatar,
                  privacy: userMe.updated[0]._privacy,
                };

                await api.post('users/mobiles/sync', user);
              }
            } catch (error) {
              throw new Error(error);
            }
          },
        });
      });

    setFlagUpdateCars(flagUpdateCars + 1);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadCars() {
      try {
        const carCollection = database.get<ModelCar>('cars');
        const cars = await carCollection
          .query()
          .fetch()
          .then((res) => {
            setCars(res);
          })
          .catch(function (error) {
            console.log('error: 01', error);
            throw new Error(error);
          });
      } catch (error) {
        console.log('error: 03', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCars();
    return () => {
      isMounted = false;
    };
  }, [flagUpdateCars]);

  useEffect(() => {
    if (netInfo.isConnected === true) {
      offLineSynchronize();
    }
  }, [netInfo.isConnected]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />
          {!loading && cars.length > 0 && (
            <TotalCars>Total de {cars.length} carros</TotalCars>
          )}
        </HeaderContent>
      </Header>

      {loading ? (
        <LoadAnimation />
      ) : (
        <CarList
          data={cars}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: true,
            },
          )}
          contentContainerStyle={{
            padding: SPACING,
            paddingTop: StatusBar.currentHeight || 42,
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const inputRange = [
              -1,
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index + 2),
            ];

            const opacityInputRange = [
              -1,
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index + 0.5),
            ];

            const opacity = scrollY.interpolate({
              inputRange: opacityInputRange,
              outputRange: [1, 1, 1, 0],
            });

            const scale = scrollY.interpolate({
              inputRange,
              outputRange: [1, 1, 1, 0],
            });

            return (
              <Animated.View
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                  opacity,
                  transform: [{ scale }],
                }}
              >
                <Car
                  data={item}
                  key={item.id}
                  onPress={() => handleCarDetails(item)}
                />
              </Animated.View>
            );
          }}
        />
      )}
    </Container>
  );
}
