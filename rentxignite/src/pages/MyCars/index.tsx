import React, { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { Animated } from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';

import { BackButton } from '../../components/BackButton';

import { api } from '../../_services/apiClient';

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

import { Car } from '../../components/Car';
import { RFValue } from 'react-native-responsive-fontsize';
import { LoadAnimation } from '../../components/LoadAnimation';
import { Car as ModelCar } from '../../database/model/Car';

interface DataProps {
  id: string;
  car: ModelCar;
  start_date: string;
  end_date: string;
}

const SPACING = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 1.8;

export function MyCars() {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const theme = useTheme();
  const screenIsFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<DataProps[]>([] as DataProps[]);
  const navigation = useNavigation();

  function handleBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function loadCars() {
      try {
        const { data } = await api.get('/rentals');

        const dataFormatted = data.map((item: DataProps) => {
          return {
            id: item.id,
            car: item.car,
            start_date: format(parseISO(item.start_date), 'dd/MM/yyyy'),
            end_date: format(parseISO(item.end_date), 'dd/MM/yyyy'),
          };
        });

        setCars(dataFormatted);
      } catch(erro) {
        console.log('Passou::: ',erro)
      } finally {
        setLoading(false);
      }
    }

    loadCars();
  }, [screenIsFocused]);

  return (
    <Container>
      <Header>
        <BackButton onPress={handleBack} color={theme.colors.shape} />
        <Title>
          Escolha uma{'\n'}
          data de início e {'\n'}
          fim do aluguel
        </Title>

        <SubTitle>Conforto, segurança e praticidade.</SubTitle>
      </Header>

      <Content>
        <Appointments>
          <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
          <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
        </Appointments>

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
            keyExtractor={(item) => String(item.id)}
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
                      height: 5,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                  }}
                >
                  <CarWrapper key={item.id}>
                    <Car data={item.car} />
                    <CarFooter>
                      <CarFooterTitle>Período</CarFooterTitle>
                      <CarFooterPeriod>
                        <CarFooterDate>{item.start_date}</CarFooterDate>

                        <AntDesign
                          name="arrowright"
                          size={RFValue(20)}
                          color={theme.colors.title}
                          style={{ marginHorizontal: RFValue(10) }}
                        />

                        <CarFooterDate>{item.end_date}</CarFooterDate>
                      </CarFooterPeriod>
                    </CarFooter>
                  </CarWrapper>
                </Animated.View>
              );
            }}
          />
        )}
      </Content>
    </Container>
  );
}
