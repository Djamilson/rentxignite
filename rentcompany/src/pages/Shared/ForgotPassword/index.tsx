import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import * as Yup from 'yup';

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

import { PasswordInput } from '../../../components/PasswordInput';

import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Form,
  FormTitle,
  Steps,
  HeaderTop,
  HeaderTitle,
  LogoutButton,
  PhotoContainerView,
  Content,
  Options,
  Option,
  OptionTitle,
  Section,
  Footer,
  OffLineInfo,
} from './styles';
import { useNetInfo } from '@react-native-community/netinfo';
import { api } from '../../../_services/apiClient';

import { Animated, Image, Text, View } from 'react-native';

import {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
  styles,
} from './styles';

const { Value, Text: AnimatedText } = Animated;

const CELL_COUNT = 4;
const source = {
  uri: 'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
};

interface IRes {
  hasValue: any;
  index: any;
  isFocused: any;
}

interface IRess {
  index: any;
  symbol: any;
  isFocused: any;
}
const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({ hasValue, index, isFocused }: IRes) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
    }),
  ]).start();
};

export function ForgotPassword() {
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState<boolean>(false);
  const [option, setOption] = useState<'dataEmail' | 'inByCode'>('dataEmail');
  const [byCod, setByCod] = useState<string>('');

  const navigation = useNavigation();
  const netInfo = useNetInfo();

  function handleBack() {
    navigation.goBack();
  }

  function handleOptionChange(optionSelected: 'dataEmail' | 'inByCode') {
    if (netInfo.isConnected === false) {
      Alert.alert(
        'Você esá offline!',
        'Para mudar a senha, conecte-se a Internet.',
      );
    } else {
      setOption(optionSelected);
    }
  }

  async function handleForgot() {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
      });
      const data = { email };
      await schema.validate(data);
      await api.post('/password/forgot', data);

      setOption('inByCode');
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

  async function hadleValidCod() {
    try {
      console.log('=>>>', value);
      Alert.alert('esfdsf::: ', value);
      // await api.post('/password/forgot', data);

      setOption('inByCode');
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

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const renderCell = ({ index, symbol, isFocused }: IRess) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    setTimeout(() => {
      animateCell({ hasValue, index, isFocused });
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

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

          <Title>Recupera {'\n'}sua senha</Title>

          <Content>
            <Options>
              <Option
                onPress={() => handleOptionChange('dataEmail')}
                active={option === 'dataEmail'}
              >
                <OptionTitle active={option === 'dataEmail'}>Email</OptionTitle>
              </Option>
              <Option
                onPress={() => handleOptionChange('inByCode')}
                active={option === 'inByCode'}
              >
                <OptionTitle active={option === 'inByCode'}>
                  Tenho código Redefinir
                </OptionTitle>
              </Option>
            </Options>
            {option === 'dataEmail' ? (
              <>
                <Section>
                  <Input
                    iconName="mail"
                    placeholder="E-mail"
                    keyboardType="email-address"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={(e: any) => setEmail(e)}
                    value={email}
                  />
                </Section>
                <Footer>
                  <Button
                    title="Solicitar"
                    onPress={handleForgot}
                    loading={loading}
                    enabled={!loading}
                  />
                </Footer>
              </>
            ) : (
              <>
                <Section>
                  <Image style={styles.icon} source={source} />
                  <Text style={styles.subTitle}>
                    Please enter the verification code{'\n'}
                    we send to your email address
                  </Text>

                  <CodeField
                    ref={ref}
                    {...props}
                    value={value}
                    onChangeText={setValue}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFiledRoot}
                    textContentType="oneTimeCode"
                    renderCell={renderCell}
                  />
                </Section>

                <Footer>
                  <Button
                    title="Validar código"
                    enabled={netInfo.isConnected === true && !loading}
                    onPress={hadleValidCod}
                    loading={loading}
                  />

                  {netInfo.isConnected === false && (
                    <OffLineInfo>
                      Conecte-se a Internet para ver fazer a solicitação de
                      recuperação de senha!
                    </OffLineInfo>
                  )}
                </Footer>
              </>
            )}
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
