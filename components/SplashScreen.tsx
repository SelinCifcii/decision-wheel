import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

interface SplashScreenProps {
    setIsLoading: (value: boolean) => void;
  }

export default function SplashScreen({ setIsLoading }: SplashScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <LottieView
        source={require('../assets/SplashForDecisionWheel.json')}
        autoPlay
        loop={false} 
        style={{
          width: 300, 
          height: 300,
        }}
        onAnimationFinish={() => {
            setIsLoading(false);
          // Animasyon bittiğinde yapılacak işlemler
        }}
      />
    </View>
  );
}