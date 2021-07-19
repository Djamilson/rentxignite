import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components';

import { Container, IconContainer, InputText, Line } from './styles';
interface IProps extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name'];
  value?: string;
}

export function Input({ iconName, value, ...rest }: IProps) {
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
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          {...rest}          
        />
      </Container>
      <Line isFocused={isFocused} />
    </>
  );
}
