import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import * as Yup from 'yup';

import { BackButton } from '../../../../components/BackButton';
import { Bullet } from '../../../../components/Bullet';
import { Input } from '../../../../components/Input';

import { Button } from '../../../../components/Button';

import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Form,
  FormTitle,
  Steps,
} from './styles';

export function SignUpFirstStep() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const nameGroup = 'role-client';

  const navigation = useNavigation();

  function handleBack() {
    navigation.goBack();
  }

  async function handleNextStep() {
    try {
      const schema = Yup.object().shape({
        driverLicense: Yup.string().required('A sua CNH é obrigatória'),

        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),

        name: Yup.string().required('Nome obrigatório'),
      });
      const data = { name, email, driverLicense };
      await schema.validate(data);

      navigation.navigate('SignUpSecondStep', { user: { ...data, nameGroup } });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert('Ooops!', error.message);
      } else {
        Alert.alert(
          'Error na autenticação!',
          'Ocorreu um erro ao tentar fazer login, tente novamente',
        );
      }
    }
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={handleBack} />
            <Steps>
              <Bullet active />
              <Bullet />
            </Steps>
          </Header>

          <Title>Crie sua{'\n'}conta</Title>

          <SubTitle>
            Faça seu cadastro de{'\n'}
            forma rápida e fácil
          </SubTitle>
          <Form>
            <FormTitle>1. Dados</FormTitle>
            <Input
              iconName="user"
              placeholder="Nome"
              value={name}
              onChangeText={(e: any) => setName(e)}
            />

            <Input
              iconName="mail"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              value={email}
              onChangeText={(e: any) => setEmail(e)}
            />

            <Input
              iconName="credit-card"
              placeholder="CNH"
              keyboardType="numeric"
              value={String(driverLicense)}
              onChangeText={(e: any) => setDriverLicense(e)}
            />
          </Form>

          <Button title="Próximo" onPress={handleNextStep} />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
