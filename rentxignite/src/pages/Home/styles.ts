import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

import { Animated } from 'react-native';
import { Car } from '../../database/model/Car';

export const Container = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.background_primary};
`;

export const Header = styled.View`
  width: 100%;
  height: 113px;
  background: ${({ theme }) => theme.colors.header};

  justify-content: flex-end;
  padding: 32px 24px;
`;

export const HeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TotalCars = styled.Text`
  font-size: ${RFValue(15)}px;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.primary_400};
`;

export const CarList = styled(
  Animated.FlatList as new () => Animated.FlatList<Car>,
).attrs({
  contentContainerStyle: {
    padding: 24,
  },
  showsHorizontalScrollIndicator: false,
})`
  padding: 0px 0px ${RFValue(16)}px;
`;
