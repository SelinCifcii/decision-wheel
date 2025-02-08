import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList
} from 'react-native';
import type { HomeScreenProps } from '../App';
import { useSocket } from '../context/SocketContext';
import { Wheel } from '../components/Wheel'; // Wheel bileşenini import ediyoruz

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
   const [winner, setWinner] = useState<string | null>(null);
  const { error } = useSocket();

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      Alert.alert('Hata', 'Lütfen bir oda kodu girin.');
      return;
    }

    navigation.navigate('OnlineRoom', { roomCode: roomCode.toUpperCase() });
    setJoinModalVisible(false);
    setRoomCode('');
  };

  const addOption = () => {
    if (inputText.trim()) {
      setOptions([...options, inputText.trim()]);
      setInputText('');
    }
  };

  const handleSpinEnd = (winner: string) => {
    setWinner(winner);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Karar Çarkı</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.onlineButton]}
          onPress={() => navigation.navigate('OnlineRoom', { roomCode: '' })}
        >
          <Text style={styles.buttonText}>Online Oda Oluştur</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.joinButton]}
          onPress={() => setJoinModalVisible(true)}
        >
          <Text style={styles.buttonText}>Odaya Katıl</Text>
        </TouchableOpacity>
      </View>

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
          options={options}
          onSpinEnd={handleSpinEnd}
          size={300}
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Eklenen Seçenekler:</Text>
        <FlatList
          data={options}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.optionItem}>
              <Text style={styles.optionText}>{item}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Henüz seçenek eklenmedi.</Text>
          }
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={joinModalVisible}
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Odaya Katıl</Text>
            
            <TextInput
              style={styles.modalInput}
              value={roomCode}
              onChangeText={setRoomCode}
              placeholder="Oda kodunu girin"
              autoCapitalize="characters"
              maxLength={6}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setJoinModalVisible(false);
                  setRoomCode('');
                }}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.modalButton, styles.joinButton]}
                onPress={handleJoinRoom}
              >
                <Text style={styles.buttonText}>Katıl</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  button: {
    width: '48%',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  onlineButton: {
    backgroundColor: '#2196F3',
  },
  joinButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  wheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
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
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 5,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    width: '45%',
    marginVertical: 0,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
});

export default HomeScreen;