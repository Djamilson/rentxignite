import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  width: 109px;
  height: 92px;
  justify-content: center;
  align-items: center;

`;

export const Content = styled.View`
  width: 99px;
  height: 82px;

  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background_primary};
`;

export const Name = styled.Text`
  font-family: ${({ theme }) => theme.fonts.primary_500};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(13)}px;
`;
