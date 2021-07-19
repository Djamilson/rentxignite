import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import { Container, Title } from './styles';

interface IProps extends RectButtonProps {
  title: string;
}

export function ConfirmButton({ title, ...rest }: IProps) {
  return (
    <Container {...rest}>
      <Title>{title}</Title>
    </Container>
  );
}
