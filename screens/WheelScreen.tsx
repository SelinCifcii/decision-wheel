import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';

type Option = {
  id: string;
  text: string;
  username: string;
};

const WheelScreen = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [inputText, setInputText] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  const addOption = () => {
    if (inputText.trim()) {
      const newOption = {
        id: Date.now().toString(),
        text: inputText.trim(),
        username: 'Kullanıcı',
      };
      setOptions([...options, newOption]);
      setInputText('');
    }
  };

  const spinWheel = () => {
    if (options.length < 2) {
      Alert.alert('Uyarı', 'Çarkı çevirmek için en az 2 seçenek gerekli!');
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsSpinning(false);
      const randomIndex = Math.floor(Math.random() * options.length);
      setWinner(options[randomIndex].text);
    });
  };

  const renderWheel = () => {
    if (options.length === 0) {
      return (
        <View style={styles.emptyWheel}>
          <Text>Henüz seçenek eklenmedi</Text>
        </View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.wheel,
          {
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
        <Svg height="300" width="300" viewBox="-150 -150 300 300">
          {options.map((option, index) => {
            const sliceAngle = (360 / options.length);
            const rotation = index * sliceAngle;
            const angle = (rotation * Math.PI) / 180;
            const nextAngle = ((rotation + sliceAngle) * Math.PI) / 180;
            const radius = 130;

            return (
              <G key={option.id}>
                <Path
                  d={`M 0 0 L ${radius * Math.cos(angle)} ${radius * Math.sin(angle)} A ${radius} ${radius} 0 0 1 ${radius * Math.cos(nextAngle)} ${radius * Math.sin(nextAngle)} Z`}
                  fill={`hsl(${(index * 360) / options.length}, 70%, 60%)`}
                  stroke="white"
                />
                <SvgText
                  x={70 * Math.cos(angle + sliceAngle / 2)}
                  y={70 * Math.sin(angle + sliceAngle / 2)}
                  fill="white"
                  textAnchor="middle"
                  transform={`rotate(${rotation + sliceAngle / 2 + 90}, ${70 * Math.cos(angle + sliceAngle / 2)}, ${70 * Math.sin(angle + sliceAngle / 2)})`}
                >
                  {option.text}
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Seçenek ekleyin..."
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addOption}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.wheelContainer}>
        {renderWheel()}
        <View style={styles.pointer} />
      </View>

      <TouchableOpacity
        style={[styles.spinButton, (isSpinning || options.length < 2) && styles.disabledButton]}
        onPress={spinWheel}
        disabled={isSpinning || options.length < 2}
      >
        <Text style={styles.spinButtonText}>Çarkı Çevir</Text>
      </TouchableOpacity>

      {winner && (
        <View style={styles.winnerContainer}>
          <Text style={styles.winnerText}>Sonuç: {winner}</Text>
        </View>
      )}

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Eklenen Seçenekler:</Text>
        <FlatList
          data={options}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.optionItem}>
              <Text style={styles.optionText}>{item.text}</Text>
              <Text style={styles.usernameText}>({item.username})</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Henüz seçenek eklenmedi.</Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  wheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 320,
    marginVertical: 20,
  },
  wheel: {
    width: 300,
    height: 300,
  },
  pointer: {
    position: 'absolute',
    top: -10,
    width: 20,
    height: 20,
    backgroundColor: 'red',
    transform: [{ rotate: '45deg' }],
  },
  emptyWheel: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  spinButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  spinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  winnerContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  winnerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  usernameText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default WheelScreen;