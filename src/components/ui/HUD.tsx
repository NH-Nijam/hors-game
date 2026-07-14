import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGameStore } from '../../store/useGameStore';

export default function HUD() {
  const score = useGameStore((state) => state.score);
  const coins = useGameStore((state) => state.coins);
  const pauseGame = useGameStore((state) => state.pauseGame);

  return (
    <View style={styles.container}>
      {/* Top Left Pause Button & Coins */}
      <View style={styles.leftContainer}>
        <TouchableOpacity style={styles.pauseButton} onPress={pauseGame}>
          <Text style={styles.pauseIcon}>||</Text>
        </TouchableOpacity>
        <View style={styles.coinBox}>
          <Text style={styles.coinText}>💰 {coins}</Text>
        </View>
      </View>

      {/* Top Center Score */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>
      
      <View style={styles.rightContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  leftContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
  },
  scoreContainer: {
    flex: 1,
    alignItems: 'center',
  },
  pauseButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#ffb300',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 3,
    marginRight: 15,
  },
  pauseIcon: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  coinBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffd54f',
  },
  coinText: {
    color: '#ffd54f',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreBox: {
    backgroundColor: '#673ab7',
    borderColor: '#ffca28',
    borderTopWidth: 3,
    borderBottomWidth: 3,
    paddingHorizontal: 40,
    paddingVertical: 5,
    minWidth: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  scoreText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  }
});
