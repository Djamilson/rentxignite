import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'styled-components';

import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

import { BackButton } from '../../../../components/BackButton';
import { Bullet } from '../../../../components/Bullet';
import { Button } from '../../../../components/Button';
import { PasswordInput } from '../../../../components/PasswordInput';

import { api } from '../../../../_services/apiClient';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Form,
  FormTitle,
  Steps,
} from './styles';

interface Params {
  token: string;
}

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const navigation = useNavigation();
  const theme = useTheme();

  const route = useRoute();
  const { token } = route.params as Params;

  function handleBack() {
    navigation.goBack();
  }

  async function handleRegister() {
    if (!password || !passwordConfirm) {
      return Alert.alert('Informe a senha e a confirmação.');
    }

    if (password != passwordConfirm) {
      return Alert.alert('As senhas não são iguais.');
    }

    try {
      console.log('==>>', passwordConfirm);
      console.log('==>>', password);
      console.log('==>>', token);

      await api.put(`/passwords/reset`, {
        token: String(token),
        password,
        password_confirmation: passwordConfirm,
      });

      navigation.navigate('Confirmation', {
        nextScreenRoute: 'SignIn',
        title: 'Senha Redefinida com sucesso!',
        message: `Agora é só fazer login\ne aproveitar.`,
      });
    } catch (error) {
      console.log('my erro:', error);
      console.log('my erro:', error.message);

      console.log('my erro:', error.response.data);
      Alert.alert(
        'Falha no cadastro de nova senha!',
        'Ocorreu uma falha ao tentar fazer a nova senha, tente novamente!',
      );
    }
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={handleBack} />
            <Steps>
              <Bullet />
              <Bullet active />
            </Steps>
          </Header>

          <Title>Redefina sua{'\n'}senha</Title>

          <SubTitle>
            Altere sua senha de{'\n'}
            forma rápida e fácil
          </SubTitle>
          <Form>
            <FormTitle>2. Sua nova senha</FormTitle>

            <PasswordInput
              iconName="lock"
              placeholder="Sua nova senha"
              onChangeText={(e: any) => setPassword(e)}
              value={password}
            />

            <PasswordInput
              iconName="lock"
              placeholder="Repetir senha"
              onChangeText={(e: any) => setPasswordConfirm(e)}
              value={passwordConfirm}
            />
          </Form>

          <Button
            title="Próximo"
            color={theme.colors.success}
            onPress={handleRegister}
          />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
