import React, { useState, useEffect } from 'react';
import {
  getBottomSpace,
  getStatusBarHeight,
} from 'react-native-iphone-x-helper';
import { StyleSheet, StatusBar } from 'react-native';
import { useTheme } from 'styled-components';

import { useNavigation, useIsFocused } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { format } from 'date-fns';

import { AntDesign } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';

import { BackButton } from '../../components/BackButton';

import { api } from '../../_services/apiClient';
import { synchronize } from '@nozbe/watermelondb/sync';

import { Rental } from '../../components/Rental';
import { RFValue } from 'react-native-responsive-fontsize';
import { LoadAnimation } from '../../components/LoadAnimation';

import { IRentalDTO } from '../../dtos/RentalDTO';
import { formatDate } from '../../utils/formatDate';

import { database } from '../../database';
import { Rental as ModelRental } from '../../database/model/Rental';

import {
  Container,
  Header,
  HeaderSub,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  About,
  Accessories,
  Footer,
  OffLineInfo,
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

export function MyRentals() {
  const [rentals, setRentals] = useState<IRentalDTO[]>([] as IRentalDTO[]);
  const [flagUpdateRentals, setFlagUpdateRentals] = useState(0);

  const [loading, setLoading] = useState(true);

  const netInfo = useNetInfo();
  const navigation = useNavigation();

  const theme = useTheme();
  const screenIsFocused = useIsFocused();

  const scrollY = useSharedValue(0);
  const scrolHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyleAnimation = useAnimatedStyle(() => {
    return {
      //aqui muda a distâcia entre o header e o ScrollView
      //260 distância do top até inicio do scrollView

      //100 largura do meu header final

      height: interpolate(
        scrollY.value,
        [0, 260],
        [260, 112],
        Extrapolate.CLAMP,
      ),
    };
  });

  const sliderCarsStyleAnimation = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 150], [1, 0], Extrapolate.CLAMP),
    };
  });

  function handleBack() {
    navigation.goBack();
  }

  async function offLineSynchronize() {
    const rentalCollection = database.get<ModelRental>('rentals');
    await rentalCollection
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
          pullChanges: async () => {
            try {
              const { data } = await api.get(`rentals/sync/pull`, {
                params: { rentals: JSON.stringify(res) },
              });

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
                  end_date: String(item.end_date),
                  expected_return_date: item.expected_return_date,
                  status: item.status,
                  total: item.total,

                  updated_at_: item.updated_at_,
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
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <Animated.View
        style={[
          headerStyleAnimation,
          styles.header,
          {
            backgroundColor: theme.colors.header,
          },
        ]}
      >
        <Header>
          <BackButton onPress={handleBack} color={theme.colors.shape} />

          <Animated.View style={sliderCarsStyleAnimation}>
            <HeaderSub>
              <Title>
                Meus{'\n'}
                agendamentos
              </Title>

              <SubTitle>Conforto, segurança e praticidade.</SubTitle>
            </HeaderSub>
          </Animated.View>
        </Header>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={scrolHandler}
        scrollEventThrottle={16}
      >
        <Details>
          <Description>
            <Brand>Agendamentos feitos</Brand>
          </Description>

          <Rent>
            <Period>Qauntidade</Period>
            <Price>{rentals.length}</Price>
          </Rent>
        </Details>

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
      </Animated.ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    overflow: 'hidden',
    zIndex: 1,
  },
  back: {
    marginTop: 0,
  },
});
