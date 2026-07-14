import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { useSaveStore } from '../../store/useSaveStore';
import { useRouter } from 'expo-router';

export default function GameOverOverlay() {
  const isGameOver = useGameStore((state) => state.isGameOver);
  const score = useGameStore((state) => state.score);
  const distance = useGameStore((state) => Math.floor(state.distance));
  const coins = useGameStore((state) => state.coins);
  const resetGame = useGameStore((state) => state.resetGame);
  const startGame = useGameStore((state) => state.startGame);
  
  const updateBestScore = useSaveStore((state) => state.updateBestScore);
  const addSaveCoins = useSaveStore((state) => state.addCoins);
  const bestScore = useSaveStore((state) => state.bestScore);
  const router = useRouter();

  // We should trigger this when game is over
  React.useEffect(() => {
    if (isGameOver) {
      updateBestScore(score, distance);
      addSaveCoins(coins);
    }
  }, [isGameOver, score, distance, coins, updateBestScore, addSaveCoins]);

  if (!isGameOver) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRASHED!</Text>
      
      <View style={styles.statsCard}>
        <Text style={styles.statText}>Score: {score}</Text>
        <Text style={styles.statText}>Distance: {distance}m</Text>
        <Text style={styles.statText}>Coins Collected: {coins}</Text>
        <Text style={[styles.statText, styles.bestText]}>Best Score: {Math.max(score, bestScore)}</Text>
      </View>

      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => startGame()}
      >
        <Text style={styles.primaryButtonText}>PLAY AGAIN</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => {
          resetGame();
          router.replace('/');
        }}
      >
        <Text style={styles.secondaryButtonText}>MAIN MENU</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 30,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  statsCard: {
    backgroundColor: '#1E1E1E',
    padding: 30,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#333',
  },
  statText: {
    color: '#FFF',
    fontSize: 20,
    marginBottom: 10,
    fontWeight: '600',
  },
  bestText: {
    color: '#FFD700',
    marginTop: 10,
    fontSize: 24,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#555',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
