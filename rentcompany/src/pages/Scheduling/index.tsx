import React, { useState, useEffect } from 'react';
import { useTheme } from 'styled-components';
import { StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';

import {
  Calendar,
  DayProps,
  generateInterval,
  MarkedDateProps,
} from '../../components/Calendar';

import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { getPlatformDate } from '../../utils/getPlatformDate';
import ArrowSvg from '../../assets/arrow.svg';

import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateTitle,
  DateValue,
  DateValueBorder,
  Content,
  Footer,
} from './styles';
import { Car as ModelCar } from '../../database/model/Car';

import { api } from '../../_services/apiClient';

import { LoadAnimation } from '../../components/LoadAnimation';
import { generateDateDisabled } from '../../components/Calendar/generateDateDisabled';
import { formatDate } from '../../utils/formatDate';

interface IRentalPeriod {
  startFormatted: string;
  endFormatted: string;
}

interface Params {
  car: ModelCar;
}

export function Scheduling() {
  const [loading, setLoading] = useState(true);
  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>(
    {} as DayProps,
  );

  const [markedDates, setMarkedDates] = useState<MarkedDateProps>(
    {} as MarkedDateProps,
  );

  const [markedDatesDisabled, setMarkedDatesDisabled] =
    useState<MarkedDateProps>({} as MarkedDateProps);

  const [rentalPeriod, setRentalPeriod] = useState<IRentalPeriod>(
    {} as IRentalPeriod,
  );

  const theme = useTheme();
  const route = useRoute();

  const { car } = route.params as Params;

  const navigation = useNavigation();

  async function loadDateRental(): Promise<void> {
    try {
      const res = await api.get(`rentals/cars/${car.id}`);

      const intervalDisabled = generateDateDisabled(res.data);

      setMarkedDatesDisabled(intervalDisabled);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDateRental();
  }, []);

  function handleConfirmRental() {
    navigation.navigate('SchedulingDetails', {
      car,
      dates: Object.keys(markedDates),
    });
  }

  function handleBack() {
    navigation.goBack();
  }

  function handleChangeDate(date: DayProps) {
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    console.log('============');
    console.log('=>>>Inicial date:', date);

    console.log('=>>>My start:', start);
    console.log('=>>>My End:', end);
    console.log('============');

    if (start.timestamp > end.timestamp) {
      start = end;
      end = start;
    }

    console.log('=>>>My start:', start);
    console.log('=>>>My End:', end);
    console.log('============');

    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMarkedDates(interval);

    const firstDate = Object.keys(interval)[0];

    console.log('=>>>My interval 0===>>:', Object.keys(interval)[0]);
    console.log('=>>>My interval ===>>:', interval);
    console.log('=>>>My firstDate:', firstDate);

    const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

    console.log('=>>>endDate:', endDate);

    const utcFirstDate = formatDate(firstDate);
    const utcEndDate = formatDate(endDate);

    setRentalPeriod({
      startFormatted: format(getPlatformDate(utcFirstDate), 'dd/MM/yyyy'),
      endFormatted: format(getPlatformDate(utcEndDate), 'dd/MM/yyyy'),
    });
  }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Header>
        <BackButton onPress={handleBack} color={theme.colors.shape} />
        <Title>
          Escolha uma{'\n'}
          data de início e {'\n'}
          fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo>
            <DateTitle>De</DateTitle>
            {!!rentalPeriod.startFormatted ? (
              <DateValue selected={!!rentalPeriod.startFormatted}>
                {rentalPeriod.startFormatted}
              </DateValue>
            ) : (
              <DateValueBorder />
            )}
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DateTitle>Até</DateTitle>

            {!!rentalPeriod.endFormatted ? (
              <DateValue selected={!!rentalPeriod.endFormatted}>
                {rentalPeriod.endFormatted}
              </DateValue>
            ) : (
              <DateValueBorder />
            )}
          </DateInfo>
        </RentalPeriod>
      </Header>

      <Content>
        {loading ? (
          <LoadAnimation />
        ) : (
          <Calendar
            markedDates={markedDates}
            markedDatesDisabled={markedDatesDisabled}
            onDayPress={handleChangeDate}
          />
        )}
      </Content>

      <Footer>
        <Button
          title="Confirmar"
          onPress={handleConfirmRental}
          enabled={!!rentalPeriod.startFormatted}
        />
      </Footer>
    </Container>
  );
}
