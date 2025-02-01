import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import WheelScreen from './screens/WheelScreen';
import OnlineRoomScreen from './screens/OnlineRoomScreen';
import { SocketProvider } from './context/SocketContext';

export type RootStackParamList = {
  Home: undefined;
  Wheel: { roomCode: string; username: string };
  OnlineRoom: { roomCode: string };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type WheelScreenProps = NativeStackScreenProps<RootStackParamList, 'Wheel'>;
export type OnlineRoomScreenProps = NativeStackScreenProps<RootStackParamList, 'OnlineRoom'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SocketProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2196F3',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Karar Çarkı' }}
          />
          <Stack.Screen 
            name="Wheel" 
            component={WheelScreen}
            options={{ title: 'Çark' }}
          />
          <Stack.Screen 
            name="OnlineRoom" 
            component={OnlineRoomScreen}
            options={{ title: 'Online Oda' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketProvider>
  );
};

export default App;