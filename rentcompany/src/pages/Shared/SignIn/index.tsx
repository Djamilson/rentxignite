import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { StatusBar, Alert, Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as Yup from 'yup';

import { useAuth } from '../../../hooks/auth';

import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { PasswordInput } from '../../../components/PasswordInput';

import {
  Container,
  Content,
  Header,
  Title,
  SubTitle,
  Form,
  Footer,
  ForgotPassword,
} from './styles';

export function SignIn() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const [password, setPassword] = useState<string>('');
  const theme = useTheme();
  const navigation = useNavigation();
  const { signIn } = useAuth();

  async function handleSignIn() {
    try {
      setLoading(true);

      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().required('A senha é obrigatória'),
      });

      await schema.validate({ email, password });

      await signIn({ email, password });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert('Ooops!', error.message);
      } else {
        Alert.alert(
          'Error na autenticação!',
          'Ocorreu um erro ao tentar fazer login, tente novamente',
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function handleNewAccount() {
    navigation.navigate('SignUpFirstStep');
  }

  function handleForgotPassword() {
    navigation.navigate('ForgotPassword');
  }

  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Content>
            <StatusBar
              barStyle="dark-content"
              translucent
              backgroundColor="transparent"
            />
            <Header>
              <Title>
                Estamos{'\n'}
                quase lá.
              </Title>
              <SubTitle>
                Faça seu login para começar{'\n'}
                uma experiência incrível.
              </SubTitle>
            </Header>
            <Form>
              <Input
                iconName="mail"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                value={email}
                onChangeText={(e: any) => setEmail(e)}
              />

              <PasswordInput
                iconName="lock"
                placeholder="Sua senha"
                onChangeText={(e: any) => setPassword(e)}
                value={password}
              />
            </Form>
            <Footer>
              <Button
                title="Login"
                onPress={handleSignIn}
                loading={loading}
                enabled={!loading}
              />

              <ForgotPassword
                color={theme.colors.background_primary}
                title="Esqueci minha senha"
                onPress={handleForgotPassword}
                enabled={true}
                loading={false}
              />

              <Button
                color={theme.colors.background_secundary}
                title="Criar conta gratuita"
                onPress={handleNewAccount}
                enabled={true}
                loading={false}
                light={true}
              />
            </Footer>
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
