import React, { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';

import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useNetInfo } from '@react-native-community/netinfo';

import { api } from '../../_services/apiClient';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { Car as ModelCar } from '../../database/model/Car';

import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Accessories,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal,
  Footer,
} from './styles';
import { formatDate } from '../../utils/formatDate';

interface Params {
  car: ModelCar;
  dates: string[];
}

interface RentalPeriod {
  start: string;
  end: string;
}

export function SchedulingDetails() {
  const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);

  const [loading, setLoading] = useState<boolean>(false);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>(
    {} as RentalPeriod,
  );

  const netInfo = useNetInfo();
  const theme = useTheme();
  const route = useRoute();

  const { car, dates } = route.params as Params;

  const navigation = useNavigation();

  const rentTotal = Number(dates.length * car.price);

  async function handleConfirmRental() {
    try {
      setLoading(true);

      await api.post(`rentals`, {
        carId: car.id,
        startDate: getPlatformDate(formatDate(String(new Date(dates[0])))),
        expected_return_date: getPlatformDate(
          formatDate(String(new Date(dates[dates.length - 1]))),
        ),
      });

      navigation.navigate('Confirmation', {
        title: `Agendamento confirmado!`,
        nextScreenRoute: 'Home',
        message: `Agora voc?? s?? precisa ir\nat?? a concession??ria da RENTX\npegar o seu autom??vel.`,
      });
    } catch (error) {
      console.log('=>> my erro:',error.message)
      let message = 'Ocorreu uma falha ao far a reserva, tente novamente!';

      const { statusCode } = error?.response.data;
      if (statusCode === 405) {
        message =
          'Esse ve??culo j?? est?? reservado para essa data, tente novamente!';
      }

      if (statusCode === 406) {
        message = 'Voc?? j?? tem reserva nessa data, tente novamente!';
      }

      navigation.goBack();
      Alert.alert('Aten????o!', `${message}`);
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    navigation.goBack();
  }

  useEffect(() => {
    setRentalPeriod({
      start: format(
        getPlatformDate(formatDate(String(new Date(dates[0])))),
        'dd/MM/yyyy',
      ),
      end: format(
        getPlatformDate(formatDate(String(new Date(dates[dates.length - 1])))),
        'dd/MM/yyyy',
      ),
    });
  }, []);

  useEffect(() => {
    async function fetchCarUpdated() {
      try {
        const { data } = await api.get(`/cars/${car.id}`);

        setCarUpdated(data);
      } catch {}
    }
    if (netInfo.isConnected === true) {
      fetchCarUpdated();
    }
  }, [netInfo.isConnected]);

  return (
    <Container>
      <Header>
        <BackButton onPress={handleBack} />
      </Header>

      <CarImages>
        <ImageSlider
          imagesUrl={
            !!carUpdated.photos
              ? carUpdated.photos
              : [{ id: car.thumbnail, photo: car.thumbnail }]
          }
        />
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.period}</Period>
            <Price>R$ {car.price}</Price>
          </Rent>
        </Details>

        {carUpdated.specifications && (
          <Accessories>
            {carUpdated.specifications.map((accessory) => (
              <Accessory
                name={accessory.name}
                key={accessory.id}
                icon={getAccessoryIcon(accessory.type)}
              />
            ))}
          </Accessories>
        )}

        <RentalPeriod>
          <CalendarIcon>
            <Feather
              name="calendar"
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>

          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>

          <Feather
            name="chevron-right"
            size={RFValue(10)}
            color={theme.colors.text}
          />

          <DateInfo>
            <DateTitle>AT??</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>
        </RentalPeriod>

        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`R$ ${car.price} x ${dates.length} d??rias`}</RentalPriceQuota>
            <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>

      <Footer>
        <Button
          title="Alugar agora"
          color={theme.colors.success}
          onPress={handleConfirmRental}
          loading={loading}
          enabled={!loading}
        />
      </Footer>
    </Container>
  );
}
