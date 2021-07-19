import React, { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';
import { format } from 'date-fns';

import { BackButton } from '../../components/BackButton';

import { api } from '../../_services/apiClient';

import { Rental } from '../../components/Rental';
import { RFValue } from 'react-native-responsive-fontsize';
import { LoadAnimation } from '../../components/LoadAnimation';
import { IRentalDTO } from '../../dtos/RentalDTO';
import { formatDate } from '../../utils/formatDate';
import {
  getStatusBarHeight,
  getBottomSpace,
} from 'react-native-iphone-x-helper';
import { synchronize } from '@nozbe/watermelondb/sync';

import { database } from '../../database';
import { Rental as ModelRental } from '../../database/model/Rental';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantity,
  CarList,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
} from './styles';
import { useNetInfo } from '@react-native-community/netinfo';

export function MyRentals() {
  const theme = useTheme();
  const netInfo = useNetInfo();
  const screenIsFocused = useIsFocused();

  const [flagUpdateRentals, setFlagUpdateRentals] = useState(0);

  const [loading, setLoading] = useState(true);
  const [rentals, setRentals] = useState<IRentalDTO[]>([] as IRentalDTO[]);
  const navigation = useNavigation();

  const scrollY = useSharedValue(0);
  const scrolHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyleAnimation = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, 230],
        [230, 90],
        Extrapolate.CLAMP,
      ),
    };
  });

  function handleBack() {
    navigation.goBack();
  }

  async function offLineSynchronize() {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        try {
          const { data } = await api.get(
            `rentals/sync/pull?lastPulledVersion=${lastPulledAt || 0}`,
          );

          const { changes, latestVersion } = data;
          console.log('Quer ### Vindo do Banco rental', data);

          return { changes, timestamp: latestVersion };
        } catch (error) {
          throw new Error(error);
        }
      },
      pushChanges: async ({}) => {
        //envia para a api
      },
    });

    setFlagUpdateRentals(flagUpdateRentals + 1);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadRentals() {
      try {
        const rentalCollection = database.get<ModelRental>('rentals');
        rentalCollection
          .query()
          .fetch()
          .then((res) => {
            setRentals(
              res?.map((item: ModelRental) => {
                return {
                  id: item.id,
                  car_id: item.car_id,
                  start_date: item.start_date,
                  expected_return_date: item.expected_return_date,
                  status: item.status,
                  total: item.total,

                  car_name: item.car_name,
                  car_brand: item.car_brand,

                  car_fuel_type: item.car_fuel_type,
                  car_category_id: item.car_category_id,
                  car_category_name: item.car_category_name,
                  car_category_description: item.car_category_description,
                  car_thumbnail: item.car_thumbnail,
                  car_photo_url: item.car_photo_url,

                  start_date_formated: format(
                    formatDate(item.start_date),
                    'dd/MM/yyyy',
                  ),
                  expected_return_date_formated: format(
                    formatDate(item.expected_return_date),
                    'dd/MM/yyyy',
                  ),
                };
              }),
            );
          });
      } catch {
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRentals();
    return () => {
      isMounted = false;
    };
  }, [flagUpdateRentals]);

  useEffect(() => {
    if (netInfo.isConnected === true) {
      offLineSynchronize();
    }
  }, [netInfo.isConnected, screenIsFocused]);

  return (
    <Container>
      <Animated.View
        style={[
          headerStyleAnimation,
          styles.header,
          {
            width: '100%',
          },
        ]}
      >
        <Header>
          <BackButton onPress={handleBack} color={theme.colors.shape} />
          <Title>
            Meus{'\n'}
            agendamentos
          </Title>

          <SubTitle>Conforto, segurança e praticidade.</SubTitle>
        </Header>
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: getStatusBarHeight() + RFValue(250),
          flex: 1,
          marginLeft: 10,
          marginRight: 40,

          paddingBottom: getBottomSpace() + RFValue(70),
        }}
        showsVerticalScrollIndicator={false}
        onScroll={scrolHandler}
        scrollEventThrottle={16}
      >
        <Content>
          <Appointments>
            <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
            <AppointmentsQuantity>{rentals.length}</AppointmentsQuantity>
          </Appointments>

          {loading ? (
            <LoadAnimation />
          ) : (
            <CarList
              data={rentals}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item, index }) => {
                return (
                  <Animated.View
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 5,
                      },
                      shadowOpacity: 0.3,
                      shadowRadius: 10,
                    }}
                  >
                    <CarWrapper key={item.id}>
                      <Rental data={item} />
                      <CarFooter>
                        <CarFooterTitle>Período</CarFooterTitle>
                        <CarFooterPeriod>
                          <CarFooterDate>
                            {item.start_date_formated}
                          </CarFooterDate>

                          <AntDesign
                            name="arrowright"
                            size={RFValue(20)}
                            color={theme.colors.title}
                            style={{ marginHorizontal: RFValue(10) }}
                          />

                          <CarFooterDate>
                            {item.expected_return_date_formated}
                          </CarFooterDate>
                        </CarFooterPeriod>
                      </CarFooter>
                    </CarWrapper>
                  </Animated.View>
                );
              }}
            />
          )}
        </Content>
      </Animated.ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 1,
  },
  back: {
    marginTop: 24,
  },
});
