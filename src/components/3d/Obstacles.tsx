import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

const POOL_SIZE = 10;
const SPAWN_X = 50;
const DESPAWN_X = -20;

export default function Obstacles() {
  const obstaclesRef = useRef<THREE.InstancedMesh>(null);
  const isPlaying = useGameStore((state) => state.isPlaying);
  const speed = useGameStore((state) => state.speed);
  const isBoosting = useGameStore((state) => state.isBoosting);
  const gameOver = useGameStore((state) => state.gameOver);

  const instances = useMemo(() => {
    const arr = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      arr.push({
        active: false,
        x: 0,
        y: 0.5, // Center of 1x1x1 box is 0.5
        z: 0,
      });
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const spawnTimer = useRef(0);

  useFrame((state, delta) => {
    if (!isPlaying || !obstaclesRef.current || useGameStore.getState().isPaused) return;

    const currentSpeed = isBoosting ? speed * 2 : speed;
    const moveAmount = currentSpeed * delta * 5; 

    spawnTimer.current -= delta;
    if (spawnTimer.current <= 0) {
      const inactiveIdx = instances.findIndex((inst) => !inst.active);
      if (inactiveIdx !== -1) {
        instances[inactiveIdx].active = true;
        instances[inactiveIdx].x = SPAWN_X;
        instances[inactiveIdx].z = 0; 
      }
      spawnTimer.current = (Math.random() * 2 + 1.5) / (currentSpeed / 5);
    }

    // Get current state from store cleanly without causing useFrame react re-renders
    const storeState = useGameStore.getState();
    const playerY = storeState.playerY;
    const isPlayerSliding = storeState.isPlayerSliding;
    const currentlyBoosting = storeState.isBoosting;
    
    for (let i = 0; i < POOL_SIZE; i++) {
      const inst = instances[i];
      if (inst.active) {
        inst.x -= moveAmount;
        
        // Player bounds approx: x: [-5.5, -4.5] since player is at x=-5, z=0
        const playerMinX = -6.0;
        const playerMaxX = -4.0;
        
        const obsMinX = inst.x - 0.5; // width is 1
        const obsMaxX = inst.x + 0.5;
        
        if (playerMaxX > obsMinX && playerMinX < obsMaxX) {
          const playerMaxY = playerY + (isPlayerSliding ? 1 : 2.5);
          const obsMaxY = inst.y + 0.5; // height is 1
          
          // Collision Check
          if (playerY < obsMaxY && playerMaxY > 0) {
             if (currentlyBoosting) {
                // Destroy Fire!
                inst.active = false;
             } else {
                // Game Over
                gameOver();
                inst.active = false;
             }
          }
        }

        if (inst.x < DESPAWN_X) {
          inst.active = false;
        }

        dummy.position.set(inst.x, inst.y, inst.z);
        
        // Animate the fire to wobble slightly
        const time = state.clock.elapsedTime;
        dummy.rotation.set(0, time * 2, Math.sin(time * 5 + i) * 0.2); 
        const scalePulse = 1 + Math.sin(time * 10 + i) * 0.1;
        dummy.scale.set(scalePulse, scalePulse, scalePulse);
        
        if (!inst.active) {
           dummy.position.set(0, -100, 0); 
        }
        
        dummy.updateMatrix();
        obstaclesRef.current.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.position.set(0, -100, 0);
        dummy.updateMatrix();
        obstaclesRef.current.setMatrixAt(i, dummy.matrix);
      }
    }
    
    obstaclesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={obstaclesRef} args={[undefined, undefined, POOL_SIZE]}>
      <boxGeometry args={[1, 1, 1]} />
      {/* Fire Material */}
      <meshStandardMaterial color="#ff3d00" emissive="#ff3d00" emissiveIntensity={0.8} />
    </instancedMesh>
  );
}
