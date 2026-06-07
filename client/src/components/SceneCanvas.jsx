import React, { useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import useSceneStore from '../hooks/useSceneStore';
import SceneObject from './SceneObject';

export default function SceneCanvas() {
  const { objects } = useSceneStore();
  const orbitRef = useRef();

  const handleDragStart = useCallback(() => {
    if (orbitRef.current) orbitRef.current.enabled = false;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (orbitRef.current) orbitRef.current.enabled = true;
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 3, 9], fov: 55 }}
      shadows
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Lighting to match a warm indoor room */}
      <ambientLight intensity={0.9} color="#fff8f0" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <pointLight position={[-4, 6, -4]} intensity={0.4} color="#ffe0b0" />

      {/* Invisible floor to receive shadows and raycasting */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <shadowMaterial transparent opacity={0.25} />
      </mesh>

      {/* Scene objects */}
      {objects.map(obj => (
        <SceneObject
          key={obj.id}
          {...obj}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ))}

      {/* Soft contact shadows on floor */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.4}
        scale={18}
        blur={2.5}
        far={5}
        color="#000000"
      />

      {/* Camera controls — left-click orbits, right-click pans */}
      <OrbitControls
        ref={orbitRef}
        minDistance={3}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.05}
        enableDamping
        dampingFactor={0.08}
        mouseButtons={{ LEFT: undefined, MIDDLE: 1, RIGHT: 0 }}
      />
    </Canvas>
  );
}
