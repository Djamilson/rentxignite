import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

import {
  Container,
  Details,
  Brand,
  Name,
  About,
  Rent,
  Period,
  Price,
  Type,
  CarImage,
} from './styles';
import { IRentalDTO } from '../../dtos/RentalDTO';

interface IProps extends RectButtonProps {
  data: IRentalDTO;
}

export function Rental({ data, ...rest }: IProps) {
  const MotorIcon = getAccessoryIcon(data?.car_fuel_type);

  return (
    <Container {...rest}>
      <Details>
        <Brand>{data.car_brand}</Brand>
        <Name>{data.car_name}</Name>

        <About>
          <Rent>
            <Period>Total</Period>
            <Price>{`R$ ${data?.total}`}</Price>
          </Rent>

          <Type>
            <MotorIcon />
          </Type>
        </About>
      </Details>

      <CarImage
        source={{
          uri: data.car_thumbnail,
        }}
        resizeMode="contain"
      />
    </Container>
  );
}
