import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Text,
  Modal,
  Dimensions
} from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export interface WheelProps {
  options: string[];
  onSpinEnd: (winner: string) => void;
  size?: number;
}

export const Wheel: React.FC<WheelProps> = ({ 
  options, 
  onSpinEnd,
  size = 300 
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<string>('');
  const spinValue = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieView>(null);

  // Her spin sonunda animasyonu resetlemek için kullanacağız
  const resetAnimation = () => {
    if (lottieRef.current) {
      lottieRef.current.reset();
    }
  };

  // Modal kapandığında animasyonu resetliyoruz
  const closeModal = () => {
    setShowResultModal(false);
    resetAnimation();
  };

  const spinWheel = () => {
    if (options.length < 2 || isSpinning) return;

    setIsSpinning(true);
    resetAnimation();

    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsSpinning(false);
      const randomIndex = Math.floor(Math.random() * options.length);
      const winner = options[randomIndex];
      setCurrentWinner(winner);
      
      // Animasyonu başlat ve ardından modalı göster
      if (lottieRef.current) {
        lottieRef.current.play();
      }
      
      setTimeout(() => {
        setShowResultModal(true);
      }, 500);
      
      onSpinEnd(winner);
    });
  };

  const renderWheel = () => {
    if (options.length === 0) {
      return (
        <View style={[styles.emptyWheel, { width: size, height: size }]}>
          <Text style={styles.emptyText}>Henüz seçenek eklenmedi</Text>
        </View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.wheel,
          {
            width: size,
            height: size,
            transform: [
              {
                rotate: spinValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '1800deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg height={size} width={size} viewBox={`-150 -150 300 300`}>
          {options.map((option, index) => {
            const sliceAngle = (360 / options.length);
            const rotation = index * sliceAngle;
            const angle = (rotation * Math.PI) / 180;
            const nextAngle = ((rotation + sliceAngle) * Math.PI) / 180;
            const radius = 130;

            return (
              <G key={index}>
                <Path
                  d={`M 0 0 L ${radius * Math.cos(angle)} ${radius * Math.sin(angle)} A ${radius} ${radius} 0 0 1 ${radius * Math.cos(nextAngle)} ${radius * Math.sin(nextAngle)} Z`}
                  fill={`hsl(${(index * 360) / options.length}, 70%, 60%)`}
                  stroke="white"
                  strokeWidth="1"
                />
                <SvgText
                  x={70 * Math.cos(angle + sliceAngle / 2)}
                  y={70 * Math.sin(angle + sliceAngle / 2)}
                  fill="white"
                  textAnchor="middle"
                  fontSize="14"
                  transform={`rotate(${rotation + sliceAngle / 2 + 90}, ${70 * Math.cos(angle + sliceAngle / 2)}, ${70 * Math.sin(angle + sliceAngle / 2)})`}
                >
                  {option}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Lottie animasyonunu her zaman render ediyoruz ama görünmez durumda */}
      <LottieView
        ref={lottieRef}
        source={require('../assets/FinalResultAnimation.json')}
        style={[
          styles.lottieAnimation,
          { opacity: showResultModal ? 1 : 0 } // Modal görünürken animasyonu göster
        ]}
        autoPlay={false}
        loop={false}
      />

      <View style={styles.wheelContainer}>
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={spinWheel}
          disabled={isSpinning || options.length < 2}
        >
          {renderWheel()}
        </TouchableOpacity>
        <View style={styles.pointer} />
      </View>

      <Modal
        visible={showResultModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.winnerTitle}>Kazanan</Text>
            <Text style={styles.winnerText}>{currentWinner}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wheel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWheel: {
    borderRadius: 150,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  pointer: {
    position: 'absolute',
    top: -10,
    width: 20,
    height: 20,
    backgroundColor: 'red',
    transform: [{ rotate: '45deg' }],
    zIndex: 1,
  },
  lottieAnimation: {
    width: width,
    height: height,
    position: 'absolute',
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: width * 0.8,
    maxWidth: 400,
  },
  winnerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  winnerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Wheel;