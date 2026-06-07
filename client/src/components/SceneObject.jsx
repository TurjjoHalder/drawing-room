import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useGLTF, Outlines } from '@react-three/drei';
import * as THREE from 'three';
import useSceneStore from '../hooks/useSceneStore';

// --- Geometry components ---

function CubeGeometry({ color, isDragged, isSelected }) {
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={isDragged ? '#ffffff' : color}
        roughness={isDragged ? 0.1 : 0.4}
        metalness={isDragged ? 0.8 : 0.2}
        emissive={isSelected ? color : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
}

function SphereGeometry({ color, isDragged, isSelected }) {
  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial
        color={isDragged ? '#ffffff' : color}
        roughness={0.2}
        metalness={isDragged ? 1 : 0.4}
        emissive={isSelected ? color : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
}

function CylinderGeom({ color, isDragged, isSelected }) {
  return (
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />
      <meshStandardMaterial
        color={isDragged ? '#ffffff' : color}
        roughness={0.3}
        metalness={isDragged ? 0.9 : 0.3}
        emissive={isSelected ? color : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
}

function TorusGeom({ color, isDragged, isSelected }) {
  return (
    <mesh castShadow receiveShadow>
      <torusGeometry args={[0.5, 0.2, 16, 60]} />
      <meshStandardMaterial
        color={isDragged ? '#ffffff' : color}
        roughness={0.1}
        metalness={isDragged ? 1 : 0.6}
        emissive={isSelected ? color : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
}

function ConeGeom({ color, isDragged, isSelected }) {
  return (
    <mesh castShadow receiveShadow>
      <coneGeometry args={[0.6, 1.2, 32]} />
      <meshStandardMaterial
        color={isDragged ? '#ffffff' : color}
        roughness={0.4}
        metalness={isDragged ? 0.7 : 0.1}
        emissive={isSelected ? color : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
}



// Geometry selector
function ObjectGeometry({ type, color, isDragged, isSelected }) {
  switch (type) {
    case 'sphere': return <SphereGeometry color={color} isDragged={isDragged} isSelected={isSelected} />;
    case 'cylinder': return <CylinderGeom color={color} isDragged={isDragged} isSelected={isSelected} />;
    case 'torus': return <TorusGeom color={color} isDragged={isDragged} isSelected={isSelected} />;
    case 'cone': return <ConeGeom color={color} isDragged={isDragged} isSelected={isSelected} />;
  
    default: return <CubeGeometry color={color} isDragged={isDragged} isSelected={isSelected} />;
  }
}

// ============================
// Main SceneObject component
// ============================
export default function SceneObject({ id, type, position, rotation, scale, color, onDragStart, onDragEnd }) {
  const groupRef = useRef();
  const isDraggingRef = useRef(false);
  const dragPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const offsetRef = useRef(new THREE.Vector3());
  const [isDragged, setIsDragged] = useState(false);

  const { camera, gl, raycaster } = useThree();
  const { selectedId, selectObject, deselectAll, updatePosition, updateScale, setDragging } = useSceneStore();
  const isSelected = selectedId === id;

  // Smooth position lerp
  const targetPos = useRef(new THREE.Vector3(position.x, position.y, position.z));
  const currentPos = useRef(new THREE.Vector3(position.x, position.y, position.z));

  // Keep target in sync with store
  useEffect(() => {
    targetPos.current.set(position.x, position.y, position.z);
  }, [position.x, position.y, position.z]);

  // Animate: lerp position + hover/drag scale
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    currentPos.current.lerp(targetPos.current, Math.min(1, delta * 18));
    groupRef.current.position.copy(currentPos.current);

    // Hover/drag float
    if (isDragged) {
      groupRef.current.position.y = currentPos.current.y + Math.sin(Date.now() * 0.004) * 0.05;
    }
  });

  // Rotate slowly when selected
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
  });

  const getPointerOnPlane = useCallback((event) => {
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera({ x, y }, camera);
    dragPlaneRef.current.set(new THREE.Vector3(0, 1, 0), -currentPos.current.y);

    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(dragPlaneRef.current, target);
    return target;
  }, [camera, gl, raycaster]);

  const handlePointerDown = useCallback((e) => {
    e.stopPropagation();
    selectObject(id);

    isDraggingRef.current = true;
    setIsDragged(true);
    setDragging(true);
    onDragStart?.();

    // Scale up while dragging
    updateScale(id, { x: 1.15, y: 1.15, z: 1.15 });

    const point = getPointerOnPlane(e.nativeEvent || e);
    if (point) {
      offsetRef.current.set(
        currentPos.current.x - point.x,
        0,
        currentPos.current.z - point.z
      );
    }

    // Capture pointer
    gl.domElement.setPointerCapture(e.pointerId);

    const handleMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const pt = getPointerOnPlane(moveEvent);
      if (pt) {
        const nx = Math.max(-9, Math.min(9, pt.x + offsetRef.current.x));
        const nz = Math.max(-9, Math.min(9, pt.z + offsetRef.current.z));
        targetPos.current.set(nx, currentPos.current.y, nz);
        updatePosition(id, { x: nx, y: currentPos.current.y, z: nz });
      }
    };

    const handleUp = () => {
      isDraggingRef.current = false;
      setIsDragged(false);
      setDragging(false);
      updateScale(id, { x: 1, y: 1, z: 1 });
      onDragEnd?.();
      gl.domElement.removeEventListener('pointermove', handleMove);
      gl.domElement.removeEventListener('pointerup', handleUp);
    };

    gl.domElement.addEventListener('pointermove', handleMove);
    gl.domElement.addEventListener('pointerup', handleUp);
  }, [id, selectObject, updatePosition, updateScale, setDragging, getPointerOnPlane, onDragStart, onDragEnd, gl]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (!isDraggingRef.current) {
      selectObject(id);
    }
  }, [id, selectObject]);

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      scale={[scale.x, scale.y, scale.z]}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      <ObjectGeometry type={type} color={color} isDragged={isDragged} isSelected={isSelected} />

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
          <ringGeometry args={[0.75, 0.85, 32]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.8} side={2} />
        </mesh>
      )}

      {/* Drag glow */}
      {isDragged && (
        <pointLight position={[0, 0, 0]} intensity={2} color="#00e5ff" distance={3} />
      )}
    </group>
  );
}

