import React from 'react';

import { Container } from './styles';

interface IProps {
  active?: boolean;
}

export function Bullet({ active = false }: IProps) {
  return <Container active={active} />;
}
