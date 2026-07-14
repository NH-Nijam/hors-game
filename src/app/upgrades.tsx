import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSaveStore } from '../store/useSaveStore';

const SKILLS = [
  { id: 'speedLevel', name: 'Speed Boost', maxLevel: 5, baseCost: 500 },
  { id: 'jumpHeightLevel', name: 'Jump Height', maxLevel: 5, baseCost: 500 },
  { id: 'boostDurationLevel', name: 'Boost Duration', maxLevel: 5, baseCost: 1000 },
  { id: 'magnetDurationLevel', name: 'Magnet Duration', maxLevel: 5, baseCost: 1000 },
];

export default function UpgradesScreen() {
  const router = useRouter();
  const coins = useSaveStore((state) => state.coins);
  const upgradeSkill = useSaveStore((state) => state.upgradeSkill);
  const state = useSaveStore((state) => state);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>BACK</Text>
        </TouchableOpacity>
        <Text style={styles.coinsText}>Coins: {coins}</Text>
      </View>
      
      <Text style={styles.title}>UPGRADES</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {SKILLS.map((skill) => {
          const currentLevel = (state as any)[skill.id] as number;
          const isMaxed = currentLevel >= skill.maxLevel;
          const cost = skill.baseCost * currentLevel;

          return (
            <View key={skill.id} style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.levelText}>Level {currentLevel} / {skill.maxLevel}</Text>
                {!isMaxed && <Text style={styles.costText}>Cost: {cost}</Text>}
              </View>

              <TouchableOpacity 
                style={[styles.button, (isMaxed || coins < cost) && styles.disabledButton]}
                onPress={() => upgradeSkill(skill.id as any, cost)}
                disabled={isMaxed || coins < cost}
              >
                <Text style={styles.buttonText}>{isMaxed ? 'MAX' : 'UPGRADE'}</Text>
              </TouchableOpacity>
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
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardInfo: {
    flex: 1,
  },
  skillName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelText: {
    color: '#ccc',
    marginTop: 5,
  },
  costText: {
    color: '#FFD700',
    marginTop: 5,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
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
