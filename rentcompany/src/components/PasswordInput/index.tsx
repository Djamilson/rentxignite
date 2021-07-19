import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BorderlessButton } from 'react-native-gesture-handler';

import { useTheme } from 'styled-components';

import { Container, IconContainer, InputText, Line } from './styles';

interface IProps extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name'];
  value?: string;
}

export function PasswordInput({ iconName, value, ...rest }: IProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(true);
  const theme = useTheme();

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  function handleInputFocus() {
    setIsFocused(true);
  }
  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!value);
  }

  function handlePasswordVisibilityChange() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  return (
    <>
      <Container>
        <IconContainer>
          <Feather
            name={iconName}
            size={24}
            color={
              isFocused || isFilled
                ? theme.colors.main
                : theme.colors.text_detail
            }
          />
        </IconContainer>
        <InputText
          secureTextEntry={isPasswordVisible}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          autoCorrect={false}
          {...rest}
        />

        <BorderlessButton onPress={handlePasswordVisibilityChange}>
          <IconContainer>
            <Feather
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={24}
              color={theme.colors.text_detail}
            />
          </IconContainer>
        </BorderlessButton>
      </Container>
      <Line isFocused={isFocused} />
    </>
  );
}
