import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, useTexture } from '@react-three/drei';
import { useGameStore } from '../../store/useGameStore';
import * as THREE from 'three';
import { Audio } from 'expo-av';
import Obstacles from './Obstacles';
import Coins from './Coins';

const Ground = () => {
  const groundRef = useRef<THREE.Mesh>(null);
  const speed = useGameStore((state) => state.speed);
  const isPlaying = useGameStore((state) => state.isPlaying);
  const isBoosting = useGameStore((state) => state.isBoosting);
  const addDistance = useGameStore((state) => state.addDistance);
  
  const texture = useTexture(require('../../assets/images/mossy_log.png')) as THREE.Texture;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 1);

  useFrame((state, delta) => {
    if (!isPlaying) return;
    const currentSpeed = isBoosting ? speed * 2 : speed;
    if (groundRef.current) {
      const material = groundRef.current.material as THREE.MeshStandardMaterial;
      if (material.map) {
        material.map.offset.x += currentSpeed * delta * 0.2; // Increased speed multiplier
      }
    }
    addDistance(currentSpeed * delta * 2);
  });

  return (
    <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[200, 10, 10, 10]} />
      <meshStandardMaterial map={texture as THREE.Texture} />
    </mesh>
  );
};

const BackgroundPlane = () => {
  const bgTexture = useTexture(require('../../assets/images/game_background.png')) as THREE.Texture;
  return (
    <mesh position={[0, 15, -20]}>
      <planeGeometry args={[80, 50]} />
      <meshBasicMaterial map={bgTexture} side={THREE.DoubleSide} />
    </mesh>
  );
};

const VoxelUnicorn = ({ isSliding, jumpVelocity }: { isSliding: boolean, jumpVelocity: number }) => {
  const frontLeft = useRef<THREE.Mesh>(null);
  const frontRight = useRef<THREE.Mesh>(null);
  const backLeft = useRef<THREE.Mesh>(null);
  const backRight = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const isPlaying = useGameStore((state) => state.isPlaying);
  
  useFrame((state) => {
    if (!frontLeft.current || !isPlaying) return;
    const time = state.clock.elapsedTime;
    const speed = 25; // Galloping speed
    // If jumpVelocity is 0, we are on ground, so gallop. Otherwise, freeze legs.
    if (jumpVelocity === 0) {
      frontLeft.current.rotation.z = Math.sin(time * speed) * 0.6;
      frontRight.current.rotation.z = -Math.sin(time * speed) * 0.6;
      backLeft.current.rotation.z = -Math.sin(time * speed + 1.5) * 0.6;
      backRight.current.rotation.z = Math.sin(time * speed + 1.5) * 0.6;
      
      // Slight body bounce
      if (groupRef.current) {
        groupRef.current.position.y = Math.abs(Math.sin(time * speed)) * 0.2;
      }
    } else {
       // Freeze legs during jump
      frontLeft.current.rotation.z = -0.5;
      frontRight.current.rotation.z = -0.3;
      backLeft.current.rotation.z = 0.5;
      backRight.current.rotation.z = 0.2;
      if (groupRef.current) groupRef.current.position.y = 0;
    }
  });

  const bodyColor = '#4fc3f7'; // Bright blue
  const maneColor = '#e1bee7'; // Pink purple
  const hornColor = '#ffd54f'; // Gold
  const eyeColor = '#000000';
  
  // Tilt based on jump velocity
  const tilt = jumpVelocity > 0 ? 0.3 : (jumpVelocity < 0 ? -0.3 : 0);
  
  return (
    <group ref={groupRef} scale={isSliding ? [0.6, 0.3, 0.6] : [0.6, 0.6, 0.6]} rotation={[0, 0, tilt]}>
      {/* Body */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      {/* Tail */}
      <mesh position={[-1.2, 1.5, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.6, 0.3, 0.3]} />
        <meshStandardMaterial color={maneColor} />
      </mesh>
      {/* Neck & Head */}
      <mesh position={[0.8, 2.2, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      {/* Snout */}
      <mesh position={[1.4, 2.0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.6]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      {/* Eye */}
      <mesh position={[1.0, 2.3, 0.41]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color={eyeColor} />
      </mesh>
      {/* Mane */}
      <mesh position={[0.4, 2.4, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.4]} />
        <meshStandardMaterial color={maneColor} />
      </mesh>
      {/* Horn */}
      <mesh position={[1.1, 2.8, 0]}>
        <coneGeometry args={[0.1, 0.8, 4]} />
        <meshStandardMaterial color={hornColor} emissive={hornColor} emissiveIntensity={0.5} />
      </mesh>
      
      {/* Legs (pivot at top) */}
      <group position={[0.7, 1, 0.3]}>
        <mesh ref={frontLeft} position={[0, -0.6, 0]}>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
      </group>
      <group position={[0.7, 1, -0.3]}>
        <mesh ref={frontRight} position={[0, -0.6, 0]}>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
      </group>
      <group position={[-0.7, 1, 0.3]}>
        <mesh ref={backLeft} position={[0, -0.6, 0]}>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
      </group>
      <group position={[-0.7, 1, -0.3]}>
        <mesh ref={backRight} position={[0, -0.6, 0]}>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
      </group>
    </group>
  );
};

const Player = () => {
  const playerRef = useRef<THREE.Group>(null);
  const isPlaying = useGameStore((state) => state.isPlaying);
  const isBoosting = useGameStore((state) => state.isBoosting);
  const jumpTrigger = useGameStore((state) => state.jumpTrigger);
  const slideTrigger = useGameStore((state) => state.slideTrigger);
  
  const velocity = useRef(0);
  const [isSliding, setIsSliding] = useState(false);
  const targetY = useRef(0);
  const gravity = -80;
  const jumpForce = 25;

  const [gallopSound, setGallopSound] = useState<Audio.Sound>();
  
  useEffect(() => {
    async function loadSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(
           require('../../assets/sounds/gallop.wav'),
           { isLooping: true }
        );
        setGallopSound(sound);
      } catch (e) {}
    }
    loadSound();
    return () => { gallopSound?.unloadAsync(); };
  }, []);

  useEffect(() => {
    if (!gallopSound) return;
    if (isPlaying && targetY.current === 0) { 
      gallopSound.playAsync(); 
    } else { 
      gallopSound.pauseAsync(); 
    }
  }, [isPlaying, gallopSound]);

  const dashTexture = useTexture(require('../../assets/images/dash_comet.png')) as THREE.Texture;
  const dashRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (jumpTrigger > 0 && targetY.current === 0) {
      velocity.current = jumpForce;
      gallopSound?.pauseAsync();
    }
  }, [jumpTrigger, gallopSound]);

  useEffect(() => {
    if (slideTrigger > 0 && targetY.current === 0) {
      setIsSliding(true);
      setTimeout(() => setIsSliding(false), 800); 
    }
  }, [slideTrigger]);

  useFrame((state, delta) => {
    if (!isPlaying || !playerRef.current || useGameStore.getState().isPaused) return;
    
    if (targetY.current > 0 || velocity.current > 0) {
      targetY.current += velocity.current * delta;
      velocity.current += gravity * delta;
      
      if (targetY.current <= 0) {
        if (velocity.current < 0 && isPlaying) {
          gallopSound?.playAsync();
        }
        targetY.current = 0;
        velocity.current = 0;
      }
    }
    
    playerRef.current.position.y += (targetY.current - playerRef.current.position.y) * 15 * delta;
    
    if (dashRef.current) {
       dashRef.current.visible = isBoosting;
       dashRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 20) * 0.1;
    }
    
    if (useGameStore.getState().playerY !== playerRef.current.position.y) {
       useGameStore.setState({ 
         playerY: playerRef.current.position.y,
         isPlayerSliding: isSliding
       });
    }
  });

  return (
    <group ref={playerRef} position={[-5, 0, 0]}>
      {/* 3D Voxel Unicorn */}
      <VoxelUnicorn isSliding={isSliding} jumpVelocity={velocity.current} />
      
      {/* Dash Comet Effect */}
      <mesh ref={dashRef} position={[1, 1.5, -0.1]} visible={false}>
        <planeGeometry args={[6, 4]} />
        <meshBasicMaterial map={dashTexture} transparent={true} side={THREE.DoubleSide} opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

export default function GameScene() {
  const bgColor = '#e88bb0'; 

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={45} />

      {/* Lighting */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 20, 5]} intensity={1} color="#ffffff" castShadow />
      
      {/* Environment */}
      <fog attach="fog" args={[bgColor, 15, 40]} />
      
      {/* Background Plane replacing solid color */}
      <BackgroundPlane />

      {/* Game Objects */}
      <Ground />
      <Player />
      <Obstacles />
      <Coins />
    </>
  );
}
