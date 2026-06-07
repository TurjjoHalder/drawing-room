import React from 'react';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';

export default function RoomEnvironment() {
  return (
    <group>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#0a0a14"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Grid on floor */}
      <Grid
        args={[20, 20]}
        position={[0, 0.001, 0]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1a1a30"
        sectionSize={4}
        sectionThickness={1}
        sectionColor="#2a2a50"
        fadeDistance={20}
        fadeStrength={1}
        infiniteGrid={false}
      />

      {/* Boundary walls (subtle, decorative) */}
      {/* Back wall */}
      <mesh position={[0, 3, -10]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial
          color="#08080f"
          roughness={1}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Left wall */}
      <mesh position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#08080f" roughness={1} />
      </mesh>

      {/* Right wall */}
      <mesh position={[10, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#08080f" roughness={1} />
      </mesh>

      {/* Glowing accent strips on walls */}
      <mesh position={[0, 0.05, -9.9]}>
        <planeGeometry args={[20, 0.04]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.3} />
      </mesh>
      <mesh position={[-9.9, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 0.04]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.3} />
      </mesh>
      <mesh position={[9.9, 0.05, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 0.04]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
