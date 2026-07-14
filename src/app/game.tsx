import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import GameScene from '../components/3d/GameScene';
import HUD from '../components/ui/HUD';
import Controls from '../components/ui/Controls';
import GameOverOverlay from '../components/ui/GameOverOverlay';
import PauseOverlay from '../components/ui/PauseOverlay';
import { useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function GameScreen() {
  const startGame = useGameStore((state) => state.startGame);
  const resetGame = useGameStore((state) => state.resetGame);
  
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    // Start game on mount
    startGame();
    
    return () => {
      // Cleanup on unmount
      resetGame();
    };
  }, [startGame, resetGame]);

  return (
    <View style={styles.container}>
      {/* 3D Canvas Layer */}
      <Canvas style={styles.canvas}>
        <React.Suspense fallback={null}>
          <GameScene />
        </React.Suspense>
      </Canvas>

      {/* 2D UI Overlay Layer */}
      <HUD />
      <Controls />
      <PauseOverlay />
      <GameOverOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue background fallback
  },
  canvas: {
    flex: 1,
  }
});
