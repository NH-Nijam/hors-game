import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGameStore } from '../../store/useGameStore';

export default function Controls() {
  const activateBoost = useGameStore((state) => state.activateBoost);
  const triggerJump = useGameStore((state) => state.triggerJump);

  return (
    <View style={styles.container}>
      {/* Left: Jump (Unicorn Rearing Icon) */}
      <TouchableOpacity style={styles.controlButton} onPress={triggerJump}>
        <Text style={styles.buttonText}>🐎</Text>
      </TouchableOpacity>

      {/* Right: Dash (Comet Icon) */}
      <TouchableOpacity style={styles.controlButton} onPress={activateBoost}>
        <Text style={styles.buttonText}>☄️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 100,
  },
  controlButton: {
    backgroundColor: '#1976d2', // Bright blue
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#ffffff', // White border
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 40, // Big emoji icons
  }
});
