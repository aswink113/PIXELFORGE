import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { MathUtils } from 'three';

import { 
  StrategyScene, 
  UIUXScene, 
  DevScene, 
  AIScene, 
  BrandScene, 
  GrowthScene 
} from './ServiceScenes';

const SCENES = [
  StrategyScene,
  UIUXScene,
  DevScene,
  AIScene,
  BrandScene,
  GrowthScene
];

// Helper to handle smooth transitions
const AnimatedSceneWrapper = ({ 
  index, 
  activeServiceIndex, 
  children 
}: { 
  index: number; 
  activeServiceIndex: number; 
  children: React.ReactNode 
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    
    // Determine target state based on relative position
    const isActive = index === activeServiceIndex;
    const isPrevious = index < activeServiceIndex;
    const isNext = index > activeServiceIndex;

    // Target properties
    let targetScale = isActive ? 1 : (isPrevious ? 0.9 : 0.8);
    let targetY = isActive ? 0 : (isPrevious ? 2.5 : -2.5);
    
    // As per user spec: Previous rotates X -12deg, Next rotates Y 18deg
    let targetRotX = isActive ? 0 : (isPrevious ? -0.2 : 0);
    let targetRotY = isActive ? 0 : (isNext ? 0.3 : 0);

    // If far away (index diff > 1), move it further away so it's out of frame quickly
    if (Math.abs(index - activeServiceIndex) > 1) {
       targetY = isPrevious ? 5 : -5;
    }

    // Smooth dampening
    const dampFactor = 5;
    
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), dampFactor * delta);
    groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, targetY, dampFactor * delta);
    
    // We only animate the wrapper rotation, the inner Float component handles continuous rotation
    groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, targetRotX, dampFactor * delta);
    groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, targetRotY, dampFactor * delta);
    
    // Material Opacity Fade
    // We traverse all materials and fade them
    // We traverse all materials and fade them
    // Instead, we just let it translate out of bounds and scale.
    // To strictly follow the "opacity 0.35" for previous, we do:
    let tOpacity = isActive ? 1 : (isPrevious && Math.abs(index - activeServiceIndex) === 1 ? 0.35 : 0);
    
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.Material;
          if (mat.transparent) {
            mat.opacity = MathUtils.lerp(mat.opacity, tOpacity, dampFactor * delta);
          }
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
};

interface ServicesCanvasProps {
  activeServiceIndex: number;
}

export const ServicesCanvas: React.FC<ServicesCanvasProps> = ({ activeServiceIndex }) => {
  return (
    <div className="w-full h-full relative">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
        
        {/* Soft studio lighting for premium Apple-like rendering */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FCFCFC" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#6D4AFF" />
        
        {/* High quality environment map for reflections (Glassmorphism depends on this!) */}
        <Environment preset="city" />

        {/* Dynamic Shadow on the "floor" */}
        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#6D4AFF" />

        {SCENES.map((SceneComponent, index) => (
          <AnimatedSceneWrapper 
            key={index} 
            index={index} 
            activeServiceIndex={activeServiceIndex}
          >
            <SceneComponent />
          </AnimatedSceneWrapper>
        ))}
      </Canvas>
    </div>
  );
};
