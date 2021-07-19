import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { Confirmation } from '../pages/Confirmation';
import { Splash } from '../pages/Splash';
import { SignIn } from '../pages/SignIn';
import { SignUpFirstStep } from '../pages/SignUp/SignUpFirstStep';
import { SignUpSecondStep } from '../pages/SignUp/SignUpSecondStep';

const { Navigator, Screen } = createStackNavigator();

export function AuthRoutes() {
  return (
    <Navigator headerMode="none" initialRouteName="Splash">
      <Screen name="Splash" component={Splash} />
      <Screen name="SignIn" component={SignIn} />
      <Screen name="SignUpFirstStep" component={SignUpFirstStep} />
      <Screen name="SignUpSecondStep" component={SignUpSecondStep} />
      <Screen name="Confirmation" component={Confirmation} />
    </Navigator>
  );
}
