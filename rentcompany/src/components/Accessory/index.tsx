import React from 'react';
import { SvgProps } from 'react-native-svg';

import { Container, Content, Name } from './styles';
import { useTheme } from 'styled-components';

interface IProps {
  name: string;
  icon: React.FC<SvgProps>;
}

export function Accessory({ name, icon: Icon }: IProps) {
  const theme = useTheme();
  return (
    <Container>
      <Content>
        <Icon width={32} height={32} fill={theme.colors.header} />
        <Name>{name}</Name>
      </Content>
    </Container>
  );
}
