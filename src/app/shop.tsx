import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSaveStore } from '../store/useSaveStore';

const HORSES = [
  { id: 'brown_horse', name: 'Brown Horse', cost: 0, color: '#8B4513' },
  { id: 'white_horse', name: 'White Horse', cost: 1000, color: '#FFFFFF' },
  { id: 'black_horse', name: 'Black Horse', cost: 2000, color: '#000000' },
  { id: 'golden_horse', name: 'Golden Horse', cost: 5000, color: '#FFD700' },
];

export default function ShopScreen() {
  const router = useRouter();
  const coins = useSaveStore((state) => state.coins);
  const unlockedHorses = useSaveStore((state) => state.unlockedHorses);
  const currentHorse = useSaveStore((state) => state.currentHorse);
  const unlockHorse = useSaveStore((state) => state.unlockHorse);
  const selectHorse = useSaveStore((state) => state.selectHorse);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>BACK</Text>
        </TouchableOpacity>
        <Text style={styles.coinsText}>Coins: {coins}</Text>
      </View>
      
      <Text style={styles.title}>HORSE SHOP</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {HORSES.map((horse) => {
          const isUnlocked = unlockedHorses.includes(horse.id);
          const isSelected = currentHorse === horse.id;

          return (
            <View key={horse.id} style={[styles.card, isSelected && styles.selectedCard]}>
              <View style={[styles.horsePreview, { backgroundColor: horse.color }]} />
              <View style={styles.cardInfo}>
                <Text style={styles.horseName}>{horse.name}</Text>
                {!isUnlocked && <Text style={styles.costText}>{horse.cost} Coins</Text>}
              </View>

              {isUnlocked ? (
                <TouchableOpacity 
                  style={[styles.button, isSelected ? styles.selectedButton : styles.selectButton]}
                  onPress={() => selectHorse(horse.id)}
                  disabled={isSelected}
                >
                  <Text style={styles.buttonText}>{isSelected ? 'EQUIPPED' : 'SELECT'}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.button, styles.buyButton, coins < horse.cost && styles.disabledButton]}
                  onPress={() => unlockHorse(horse.id, horse.cost)}
                  disabled={coins < horse.cost}
                >
                  <Text style={styles.buttonText}>BUY</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
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
  coinsText: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#4CAF50',
  },
  horsePreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#fff',
  },
  cardInfo: {
    flex: 1,
  },
  horseName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  costText: {
    color: '#FFD700',
    marginTop: 5,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  selectButton: {
    backgroundColor: '#2196F3',
  },
  buyButton: {
    backgroundColor: '#FF9800',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
