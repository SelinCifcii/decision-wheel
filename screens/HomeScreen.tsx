import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Modal,
  TextInput,
  Alert 
} from 'react-native';
import type { HomeScreenProps } from '../App';
import { useSocket } from '../context/SocketContext';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [roomCode, setRoomCode] = useState('');
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Karar Çarkı</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Wheel', { roomCode: '', username: 'Yerel Kullanıcı' })}
      >
        <Text style={styles.buttonText}>Yeni Çark Oluştur</Text>
      </TouchableOpacity>

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
              style={styles.input}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    width: '80%',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
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
    fontSize: 18,
    fontWeight: '600',
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
  input: {
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