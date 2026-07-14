import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSaveStore } from '../store/useSaveStore';

export default function MainMenuScreen() {
  const router = useRouter();
  const bestScore = useSaveStore((state) => state.bestScore);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);

  return (
    <ImageBackground 
      source={require('../assets/images/menu_bg.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.content}>
        {/* Top Left Score Box */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreTitle}>HIGH SCORE</Text>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreValue}>{bestScore}</Text>
          </View>
        </View>

        {/* Center Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoTop}>RAINBOW</Text>
          <View style={styles.logoRibbon}>
            <Text style={styles.logoBottom}>HORSE RUN</Text>
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity 
          style={styles.playButton}
          onPress={() => router.push('/game')}
        >
          <Text style={styles.playIcon}>▶</Text>
          <Text style={styles.playButtonText}>START</Text>
        </TouchableOpacity>

        {/* Bottom Circular Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={[styles.circleButton, {backgroundColor: '#9c27b0'}]}>
            <Text style={styles.circleIcon}>ADS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.circleButton, {backgroundColor: '#d84315'}]}>
            <Text style={styles.circleIcon}>🏆</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.circleButton, {backgroundColor: '#0288d1'}]}>
            <Text style={styles.circleIcon}>🔗</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.circleButton, {backgroundColor: '#f57c00'}]}>
            <Text style={styles.circleIcon}>⭐</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scoreContainer: {
    position: 'absolute',
    top: 20,
    left: 80,
    alignItems: 'center'
  },
  scoreTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  scoreBox: {
    backgroundColor: '#005b9f',
    borderColor: '#42a5f5',
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 5,
    marginTop: 5,
  },
  scoreValue: {
    color: '#FFEB3B',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoTop: {
    fontSize: 60,
    fontWeight: '900',
    color: '#FFB300',
    textShadowColor: '#d84315',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    letterSpacing: 2,
  },
  logoRibbon: {
    backgroundColor: '#673ab7',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#d1c4e9',
    marginTop: -10,
    transform: [{ rotate: '-2deg' }]
  },
  logoBottom: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  playButton: {
    backgroundColor: '#43a047',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#e8f5e9',
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  playIcon: {
    color: 'white',
    fontSize: 24,
    marginRight: 10,
  },
  playButtonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    elevation: 5,
  },
  circleIcon: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  }
});
