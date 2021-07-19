import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
import { TextInput } from 'react-native';

interface IProps {
  isFocused: boolean;
}

export const Container = styled.View`
  flex-direction: row;
`;

export const IconContainer = styled.View`
  width: 55px;
  height: 56px;
  justify-content: center;
  align-items: center;

  margin-right: 2px;
  background-color: ${({ theme }) => theme.colors.background_secundary};


`;

export const InputText = styled(TextInput)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_secundary};

  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.primary_400};
  font-size: ${RFValue(15)}px;

  padding: 0 23px;

`;



export const Line = styled.View<IProps>`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background_secundary};

  ${({ isFocused, theme }) =>
    isFocused &&
    css`
      border-top-width: 2px;
      border-top-color: ${theme.colors.main};
    `};

  margin-top: -1px;
  margin-bottom: 8px;
`;
