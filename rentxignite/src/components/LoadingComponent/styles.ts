import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: ${RFValue(22)}px;
  opacity: 0.8;
`;

export const Title = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: ${RFValue(15)}px;
  line-height: ${RFValue(44)}px;
  color: ${({ theme }) => theme.colors.shape};
  margin-top: ${RFValue(80)}px;
  width: ${RFValue(250)}px;
  font-family: ${({ theme }) => theme.fonts.primary_500};
`;
