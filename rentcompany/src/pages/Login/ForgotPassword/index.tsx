import React, { useRef, useState } from 'react';

import {
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Yup from 'yup';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNetInfo } from '@react-native-community/netinfo';

import { BackButton } from '../../../components/BackButton';
import { Input } from '../../../components/Input';
import { PasswordInput } from '../../../components/PasswordInput';
import { Button } from '../../../components/Button';
import { useAuth } from '../../../hooks/auth';

import { api } from '../../../_services/apiClient';

import {
  Container,
  Header,
  HeaderTop,
  HeaderTitle,
  LogoutButton,
  PhotoContainerView,
  PhotoContainer,
  Photo,
  PhotoButton,
  Content,
  Options,
  Option,
  OptionTitle,
  Section,
  Footer,
  OffLineInfo,
} from './styles';

function ForgotPassword() {
  const { user, signOut, updateUser } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [option, setOption] = useState<'dataEdit' | 'passwordEdit'>('dataEdit');
  const [avatar, setAvatar] = useState(user.person_avatar);
  const [name, setName] = useState(user.person_name);
  const [driverLicense, setDriverLicense] = useState(
    user.person_driver_license,
  );

  const [oldPassword, setOldPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const netInfo = useNetInfo();
  const theme = useTheme();

  const navigation = useNavigation();

  function handleBack() {
    navigation.goBack();
  }

  function handleSignOut() {
    Alert.alert(
      'Tem certeza?',
      'Se você sair, irá precisar de internet para conectar-se novamente.',
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Sair',
          onPress: () => signOut(),
        },
      ],
    );
  }

  function handleOptionChange(optionSelected: 'dataEdit' | 'passwordEdit') {
    if (netInfo.isConnected === false && optionSelected === 'passwordEdit') {
      Alert.alert(
        'Você esá offlene!',
        'Para mudar a senha, conecte-se a Internet.',
      );
    } else {
      setOption(optionSelected);
    }
  }

  async function handleAvatarSelect() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (result.cancelled) {
      return;
    }

    if (result.uri) {
      setAvatar(result.uri);
    }
  }

  async function handlerForgotPasswordUpdate() {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().required('CNH é obrigatória'),
      });
      const data = { email };
      await schema.validate(data);


      Alert.alert('Sucesso!', 'Perfil atualizado.');
    } catch {
      Alert.alert(
        'Atenção!',
        'Não foi possível fazer a alteração, tente novamente.',
      );
    }
  }

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Header>
          <HeaderTop>
            <BackButton color={theme.colors.shape} onPress={handleBack} />
            <HeaderTitle> Recuperação de senha</HeaderTitle>
            <LogoutButton onPress={handleSignOut}>
              <Feather name="power" size={24} color={theme.colors.shape} />
            </LogoutButton>
          </HeaderTop>
        </Header>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Container>
            <Content
              style={{
                marginTop: useBottomTabBarHeight() + RFValue(90),
                paddingBottom: RFValue(50),
              }}
            >
              <Options>
                <Option
                  onPress={() => handleOptionChange('dataEdit')}
                  active={option === 'dataEdit'}
                >
                  <OptionTitle active={option === 'dataEdit'}>
                    Email
                  </OptionTitle>
                </Option>
                <Option
                  onPress={() => handleOptionChange('passwordEdit')}
                  active={option === 'passwordEdit'}
                >
                  <OptionTitle active={option === 'passwordEdit'}>
                    Já tenho o código de redefinição
                  </OptionTitle>
                </Option>
              </Options>
              {option === 'dataEdit' ? (
                <>
                  <Section>
                    <Input
                      iconName="mail"
                      editable={false}
                      onChangeText={(e: any) => setEmail(e)}
                    />
                  </Section>
                  <Footer>
                    <Button
                      title="Solicitar"
                      onPress={handlerForgotPasswordUpdate}
                      loading={loading}
                      enabled={!loading}
                    />
                  </Footer>
                </>
              ) : (
                <>
                  <Section>
                    <PasswordInput
                      iconName="lock"
                      placeholder="Senha atual"
                      onChangeText={(e: any) => setOldPassword(e)}
                    />
                  </Section>

                  <Footer>
                    <Button
                      title="Salvar alterações"
                      enabled={netInfo.isConnected === true}
                      loading={loading}
                      onPress={handlerForgotPasswordUpdate}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

export { ForgotPassword };
