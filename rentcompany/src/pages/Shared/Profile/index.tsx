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

function Profile() {
  const { user, signOut, updateUser } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
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
        'Você esá offline!',
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

  async function handlerProfileUpdate() {
    try {
      const schema = Yup.object().shape({
        driverLicense: Yup.string().required('CNH é obrigatória'),
        name: Yup.string().required('Nome é obrigatório'),
      });
      const data = { name, driverLicense };
      await schema.validate(data);

      updateUser({
        id: user.id,
        user_id: user.user_id,
        person_email: user.person_email,
        person_name: name,
        person_driver_license: driverLicense,
        person_avatar: avatar,
        person_avatar_url: avatar,

        person_status: user.person_status,
        person_privacy: user.person_privacy,
        person_id: user.person_id,

        token: user.token,
        refreshToken: user.refreshToken,
      });

      Alert.alert('Sucesso!', 'Perfil atualizado.');
    } catch {
      Alert.alert(
        'Atenção!',
        'Não foi possível fazer a alteração, tente novamente.',
      );
    }
  }

  async function handlerPasswordUpdate() {
    try {
      const schema = Yup.object().shape({
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: (val: any) => !!val.length,
          then: Yup.string().required(
            'Senha atual é obrigatorio, tente novamente.',
          ),
          otherwise: Yup.string(),
        }),
        password_confirmation: Yup.string()
          .when('old_password', {
            is: (val: any) => !!val.length,
            then: Yup.string().required(
              'Confirmação de senha é obrigatorio, tente novamente.',
            ),
            otherwise: Yup.string(),
          })
          .oneOf(
            [Yup.ref('password'), 'null'],
            'Confirmação de senha incorreta, tente novamente.',
          ),
      });
      const data = {
        old_password: oldPassword,
        password,
        password_confirmation: confirmPassword,
      };

      await schema.validate(data).then(async () => {
        await api.put('/profiles/passwords', data);

        Alert.alert('Sucesso!', 'Senha atualizada com sucesso.');

        setOldPassword('');
        setPassword('');
        setConfirmPassword('');
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert('Ooops!', error.message);
      } else {
        Alert.alert(
          'Error na alteração!',
          'Ocorreu um erro ao tetar fazer alteração de senha, tente novamente',
        );
      }
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
            <HeaderTitle> Editar Perfil</HeaderTitle>
            <LogoutButton onPress={handleSignOut}>
              <Feather name="power" size={24} color={theme.colors.shape} />
            </LogoutButton>
          </HeaderTop>
        </Header>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <PhotoContainerView>
            <PhotoContainer>
              {!!avatar && (
                <Photo
                  source={{
                    uri: avatar,
                  }}
                />
              )}

              <PhotoButton onPress={handleAvatarSelect}>
                <Feather name="camera" size={24} color={theme.colors.shape} />
              </PhotoButton>
            </PhotoContainer>
          </PhotoContainerView>

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
                    Dados
                  </OptionTitle>
                </Option>
                <Option
                  onPress={() => handleOptionChange('passwordEdit')}
                  active={option === 'passwordEdit'}
                >
                  <OptionTitle active={option === 'passwordEdit'}>
                    Trocar senha
                  </OptionTitle>
                </Option>
              </Options>
              {option === 'dataEdit' ? (
                <>
                  <Section>
                    <Input
                      iconName="user"
                      placeholder="Nome"
                      autoCorrect={false}
                      defaultValue={user.person_name}
                      onChangeText={(e: any) => setName(e)}
                    />
                    <Input
                      iconName="mail"
                      editable={false}
                      defaultValue={user.person_email}
                    />

                    <Input
                      iconName="credit-card"
                      placeholder="CNH"
                      onChangeText={(e: any) => setDriverLicense(e)}
                      keyboardType="numeric"
                      defaultValue={user.person_driver_license}
                    />
                  </Section>
                  <Footer>
                    <Button
                      title="Salvar alterações"
                      onPress={handlerProfileUpdate}
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
                      defaultValue={oldPassword}
                    />
                    <PasswordInput
                      iconName="lock"
                      placeholder="Nova senha"
                      onChangeText={(e: any) => setPassword(e)}
                      defaultValue={password}
                    />
                    <PasswordInput
                      iconName="lock"
                      placeholder="Confirma senha"
                      onChangeText={(e: any) => setConfirmPassword(e)}
                      defaultValue={confirmPassword}
                    />
                  </Section>

                  <Footer>
                    <Button
                      title="Salvar alterações"
                      enabled={netInfo.isConnected === true}
                      loading={loading}
                      onPress={handlerPasswordUpdate}
                    />

                    {netInfo.isConnected === false && (
                      <OffLineInfo>
                        Conecte-se a Internet para ver mais detalhes e agendar
                        seu carro!
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

export { Profile };
