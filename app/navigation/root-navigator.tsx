import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useMemo} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import {AppRoute} from './app-routes';
import {flex1} from '../theming/Constants';
import HomeScreen from '../screens/home-screen/home-screen';
import {Colors} from '../theming/Colors';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const stackOptions = useMemo(
    () => ({
      headerShown: false,
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        color: Colors.white,
      },
      title: '',
    }),
    [],
  );

  useEffect(() => {
    const init = async () => {
      // Perform other tasks here
    };
    init().finally(async () => {});
  }, []);

  return (
    <SafeAreaView edges={['right', 'left']} style={flex1}>
      <Stack.Navigator
        initialRouteName={AppRoute.HomeScreen}
        screenOptions={stackOptions}>
        <Stack.Screen name={AppRoute.HomeScreen} component={HomeScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
