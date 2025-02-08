import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { Wheel } from '../components/Wheel';

type Option = {
  id: string;
  text: string;
  username: string;
};

type WheelScreenProps = NativeStackScreenProps<RootStackParamList, 'Wheel'>;

const WheelScreen: React.FC<WheelScreenProps> = ({ route }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [inputText, setInputText] = useState('');
  const [winner, setWinner] = useState<string | null>(null);

  const addOption = () => {
    if (inputText.trim()) {
      const newOption = {
        id: Date.now().toString(),
        text: inputText.trim(),
        username: route.params.username || 'Kullanıcı',
      };
      setOptions([...options, newOption]);
      setInputText('');
    }
  };

  const handleSpinEnd = (winner: string) => {
    setWinner(winner);
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
        <Wheel 
          options={options.map(opt => opt.text)}
          onSpinEnd={handleSpinEnd}
          size={300}
        />
      </View>

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
    marginVertical: 20,
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