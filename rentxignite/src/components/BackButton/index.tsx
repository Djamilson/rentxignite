import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {BorderlessButtonProperties} from 'react-native-gesture-handler'

import { Container } from './styles';
import { useTheme } from 'styled-components';

interface IProps extends BorderlessButtonProperties {
  color?: string;
}

export function BackButton({ color, ...rest }: IProps) {
  const theme = useTheme();
  return (
    <Container {...rest}>
      <MaterialCommunityIcons
        size={24}
        name="chevron-left"
        color={color ? color : theme.colors.text}
      />
    </Container>
  );
}
