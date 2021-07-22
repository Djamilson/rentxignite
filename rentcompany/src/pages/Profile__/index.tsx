import React, { useState } from 'react';

import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from 'yup';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNetInfo } from '@react-native-community/netinfo';

import { useAuth } from '../../hooks/auth';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BackButton } from '../../components/BackButton';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { Button } from '../../components/Button';

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
} from './styles';
import { Platform } from 'react-native';

function Profile() {
  const { user, signOut, updateUser } = useAuth();
  const [option, setOption] = useState<'dataEdit' | 'passwordEdit'>('dataEdit');
  const [avatar, setAvatar] = useState(user.person_avatar);
  const [name, setName] = useState(user.person_name);
  const [driverLicense, setDriverLicense] = useState(
    user.person_driver_license,
  );

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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior="position">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <HeaderTop>
              <BackButton color={theme.colors.shape} onPress={handleBack} />
              <HeaderTitle> Editar Perfil</HeaderTitle>
              <LogoutButton onPress={handleSignOut}>
                <Feather name="power" size={24} color={theme.colors.shape} />
              </LogoutButton>
            </HeaderTop>
          </Header>

          <ScrollView >
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
                  marginTop: useBottomTabBarHeight(),
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
                ) : (
                  <Section>
                    <PasswordInput iconName="lock" placeholder="Senha atual" />

                    <PasswordInput iconName="lock" placeholder="Nova senha" />

                    <PasswordInput
                      iconName="lock"
                      placeholder="Confirma senha"
                    />
                  </Section>
                )}
                <Button
                  title="Salvar alterações"
                  onPress={handlerProfileUpdate}
                />
              </Content>
            </Container>
          </ScrollView>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export { Profile };
