import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSaveStore } from '../store/useSaveStore';

export default function SettingsScreen() {
  const router = useRouter();
  const musicEnabled = useSaveStore((state) => state.musicEnabled);
  const soundEnabled = useSaveStore((state) => state.soundEnabled);
  const vibrationEnabled = useSaveStore((state) => state.vibrationEnabled);
  const toggleSetting = useSaveStore((state) => state.toggleSetting);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>BACK</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.title}>SETTINGS</Text>

      <View style={styles.card}>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Music</Text>
          <Switch 
            value={musicEnabled} 
            onValueChange={() => toggleSetting('musicEnabled')} 
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={musicEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Sound Effects</Text>
          <Switch 
            value={soundEnabled} 
            onValueChange={() => toggleSetting('soundEnabled')} 
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={soundEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Vibration</Text>
          <Switch 
            value={vibrationEnabled} 
            onValueChange={() => toggleSetting('vibrationEnabled')} 
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={vibrationEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  settingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  }
});
