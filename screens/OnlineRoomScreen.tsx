import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import type { OnlineRoomScreenProps } from '../App';
import { useSocket } from '../context/SocketContext';

const OnlineRoomScreen = ({ navigation, route }: OnlineRoomScreenProps) => {
  const { joinRoom, createRoom, error } = useSocket();
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (error) {
      Alert.alert('Hata', error);
    }
  }, [error]);

  useEffect(() => {
    if (!route.params.roomCode) {
      // Yeni oda oluştur
      const newRoomCode = createRoom();
      setRoomCode(newRoomCode);
      setIsHost(true);
    } else {
      // Var olan odaya katıl
      setRoomCode(route.params.roomCode);
      setIsHost(false);
    }
  }, [route.params.roomCode]);

  const handleJoinRoom = () => {
    if (!username.trim()) {
      Alert.alert('Hata', 'Lütfen bir kullanıcı adı girin.');
      return;
    }

    joinRoom(roomCode, username.trim());
    navigation.replace('Wheel', { roomCode, username: username.trim() });
  };

  const shareRoomCode = async () => {
    try {
      await Share.share({
        message: `Karar Çarkı odama katıl! Oda kodu: ${roomCode}`,
      });
    } catch (error) {
      Alert.alert('Hata', 'Oda kodu paylaşılırken bir hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      {isHost ? (
        <>
          <View style={styles.codeContainer}>
            <Text style={styles.label}>Oda Kodunuz:</Text>
            <Text style={styles.codeText}>{roomCode}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Adınız:</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Adınızı girin"
              maxLength={20}
            />
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={shareRoomCode}
          >
            <Text style={styles.buttonText}>Oda Kodunu Paylaş</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { marginTop: 10 }]}
            onPress={handleJoinRoom}
            disabled={!username.trim()}
          >
            <Text style={styles.buttonText}>Odaya Gir</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.codeContainer}>
            <Text style={styles.label}>Oda Kodu:</Text>
            <Text style={styles.codeText}>{roomCode}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Adınız:</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Adınızı girin"
              maxLength={20}
            />
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={handleJoinRoom}
            disabled={!username.trim()}
          >
            <Text style={styles.buttonText}>Odaya Katıl</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  codeContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  codeText: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 5,
    color: '#2196F3',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnlineRoomScreen;