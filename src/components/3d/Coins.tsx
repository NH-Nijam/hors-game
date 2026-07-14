import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

const POOL_SIZE = 30;
const SPAWN_X = 60;
const DESPAWN_X = -20;

export default function Coins() {
  const coinsRef = useRef<THREE.InstancedMesh>(null);
  const isPlaying = useGameStore((state) => state.isPlaying);
  const speed = useGameStore((state) => state.speed);
  const isBoosting = useGameStore((state) => state.isBoosting);
  const addCoin = useGameStore((state) => state.addCoin);

  const instances = useMemo(() => {
    const arr = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      arr.push({
        active: false,
        x: 0,
        y: 1, 
        z: 0,
        rotationY: 0, 
      });
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const spawnTimer = useRef(2);

  useFrame((state, delta) => {
    if (!isPlaying || !coinsRef.current || useGameStore.getState().isPaused) return;

    const currentSpeed = isBoosting ? speed * 2 : speed;
    const moveAmount = currentSpeed * delta * 5;

    spawnTimer.current -= delta;
    if (spawnTimer.current <= 0) {
      let spawnedCount = 0;
      const patternLength = 5;
      const yHeight = [1, 2.5, 4][Math.floor(Math.random() * 3)]; // Different heights
      
      for (let i = 0; i < POOL_SIZE && spawnedCount < patternLength; i++) {
        if (!instances[i].active) {
          instances[i].active = true;
          instances[i].x = SPAWN_X + (spawnedCount * 3);
          instances[i].y = yHeight; 
          instances[i].z = 0;
          spawnedCount++;
        }
      }
      
      spawnTimer.current = (Math.random() * 3 + 2) / (currentSpeed / 5);
    }

    const playerY = useGameStore.getState().playerY;
    const isPlayerSliding = useGameStore.getState().isPlayerSliding;
    const hasMagnet = useGameStore.getState().hasMagnet;

    const playerMinX = -6;
    const playerMaxX = -4;
    const playerMaxY = playerY + (isPlayerSliding ? 1 : 2.5);

    for (let i = 0; i < POOL_SIZE; i++) {
      const inst = instances[i];
      if (inst.active) {
        
        if (hasMagnet) {
          if (inst.x < 20 && inst.x > -10) {
            inst.x += (-5 - inst.x) * delta * 5;
            inst.y += ((playerY + 1) - inst.y) * delta * 5;
          }
        }
        
        inst.x -= moveAmount;
        inst.rotationY += delta * 3; 

        const coinMinX = inst.x - 0.5;
        const coinMaxX = inst.x + 0.5;
        
        if (playerMaxX > coinMinX && playerMinX < coinMaxX) {
          const coinMaxY = inst.y + 0.5;
          if (playerY < coinMaxY && playerMaxY > (inst.y - 0.5)) {
             addCoin(1);
             inst.active = false;
          }
        }

        if (inst.x < DESPAWN_X) {
          inst.active = false;
        }

        dummy.position.set(inst.x, inst.y, inst.z);
        dummy.rotation.set(Math.PI / 2, 0, inst.rotationY); // face camera, but spin
        
        if (!inst.active) {
           dummy.position.set(0, -100, 0); 
        }
        
        dummy.updateMatrix();
        coinsRef.current.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.position.set(0, -100, 0);
        dummy.updateMatrix();
        coinsRef.current.setMatrixAt(i, dummy.matrix);
      }
    }
    
    coinsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={coinsRef} args={[undefined, undefined, POOL_SIZE]}>
      <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
      <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
    </instancedMesh>
  );
}
