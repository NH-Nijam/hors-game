import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { useRouter } from 'expo-router';

export default function PauseOverlay() {
  const isPaused = useGameStore((state) => state.isPaused);
  const resumeGame = useGameStore((state) => state.resumeGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const router = useRouter();

  if (!isPaused) return null;

  return (
    <View style={styles.overlay}>
      <Text style={styles.title}>PAUSED</Text>
      
      <TouchableOpacity style={styles.button} onPress={resumeGame}>
        <Text style={styles.buttonText}>RESUME</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#f44336', marginTop: 20 }]} 
        onPress={() => {
          resumeGame(); // Clear pause state
          resetGame();
          router.replace('/');
        }}
      >
        <Text style={styles.buttonText}>QUIT TO MENU</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#ffeb3b',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  }
});
