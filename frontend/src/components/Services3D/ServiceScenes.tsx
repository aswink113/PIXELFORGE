import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Float, 
  Sphere, 
  MeshTransmissionMaterial, 
  RoundedBox,
  TorusKnot,
  Cylinder,
  Box,
  PointMaterial,
  Icosahedron
} from '@react-three/drei';
import * as THREE from 'three';

// 1. Digital Strategy - Holographic Globe
export const StrategyScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1.4, 32, 32]}>
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={2}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color="#EBF0FF"
            transmission={0.9}
            roughness={0.1}
          />
        </Sphere>
        <Sphere args={[1.35, 16, 16]}>
          <meshBasicMaterial color="#6D4AFF" wireframe transparent opacity={0.15} />
        </Sphere>
        {/* Core glow */}
        <Sphere args={[0.5, 16, 16]}>
          <meshBasicMaterial color="#8B5DFF" transparent opacity={0.4} />
        </Sphere>
      </Float>
    </group>
  );
};

// 2. UI/UX Design - Layered Glass Interface
export const UIUXScene = () => {
  return (
    <group>
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={1.5}>
        <group rotation={[0.4, -0.4, 0]}>
          {/* Back plate */}
          <RoundedBox args={[2.8, 1.8, 0.1]} radius={0.1} position={[0, 0, -0.4]}>
             <MeshTransmissionMaterial thickness={0.5} color="#F3F4F6" transmission={0.9} roughness={0.2} />
          </RoundedBox>
          {/* Middle Elements */}
          <RoundedBox args={[1.2, 0.8, 0.05]} radius={0.05} position={[-0.6, 0.3, 0]}>
             <meshStandardMaterial color="#6D4AFF" transparent opacity={0.8} />
          </RoundedBox>
          <RoundedBox args={[1.2, 0.4, 0.05]} radius={0.05} position={[-0.6, -0.4, 0]}>
             <meshStandardMaterial color="#8B5DFF" transparent opacity={0.6} />
          </RoundedBox>
          <RoundedBox args={[1.0, 1.4, 0.05]} radius={0.05} position={[0.7, 0, 0]}>
             <meshStandardMaterial color="#E2E8F0" transparent opacity={0.9} roughness={0.1} />
          </RoundedBox>
          {/* Front floating action button */}
          <Sphere args={[0.2, 32, 32]} position={[0.7, -0.4, 0.3]}>
            <meshStandardMaterial color="#FCFCFC" roughness={0.1} metalness={0.8} />
          </Sphere>
        </group>
      </Float>
    </group>
  );
};

// 3. Web & Mobile Dev - Floating Glowing Code Cubes
export const DevScene = () => {
  return (
    <group>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <group rotation={[0.5, 0.5, 0]}>
          {/* Main glass block */}
          <Box args={[1.5, 1.5, 1.5]}>
            <MeshTransmissionMaterial thickness={1.5} color="#E0E7FF" transmission={0.95} roughness={0.1} clearcoat={1} />
          </Box>
          {/* Inner core */}
          <Icosahedron args={[0.5, 0]} position={[0,0,0]}>
            <meshStandardMaterial color="#6D4AFF" wireframe={true} emissive="#6D4AFF" emissiveIntensity={2} />
          </Icosahedron>
          {/* Orbiting fragments */}
          <Box args={[0.3, 0.3, 0.3]} position={[1.2, 1.2, 0]}>
            <meshStandardMaterial color="#8B5DFF" roughness={0.2} metalness={0.8} />
          </Box>
          <Box args={[0.4, 0.4, 0.4]} position={[-1.2, -1, 0.5]}>
            <meshStandardMaterial color="#6D4AFF" roughness={0.2} metalness={0.8} />
          </Box>
        </group>
      </Float>
    </group>
  );
};

// 4. AI Integration - Neural Particles
export const AIScene = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate random points in a sphere
  const [positions] = useMemo(() => {
    const pos = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.2 * Math.cbrt(Math.random()); // Random radius up to 1.2
      pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i*3+2] = r * Math.cos(phi);
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <PointMaterial size={0.06} color="#6D4AFF" transparent opacity={0.8} sizeAttenuation={true} />
        </points>
        {/* Central brain core */}
        <Sphere args={[0.6, 32, 32]}>
           <MeshTransmissionMaterial thickness={1} color="#E5E7EB" transmission={0.9} roughness={0.3} />
        </Sphere>
        <Sphere args={[0.3, 16, 16]}>
           <meshBasicMaterial color="#8B5DFF" transparent opacity={0.6} />
        </Sphere>
      </Float>
    </group>
  );
};

// 5. Brand Identity - Majestic Geometric Shapes
export const BrandScene = () => {
  return (
    <group>
      <Float speed={3} rotationIntensity={1.5} floatIntensity={1.5}>
        <TorusKnot args={[0.8, 0.25, 128, 32]} position={[0, 0, 0]}>
          <MeshTransmissionMaterial 
            thickness={1} 
            color="#F9FAFB" 
            transmission={0.9} 
            roughness={0.05} 
            clearcoat={1} 
            ior={1.5} 
            chromaticAberration={0.04}
          />
        </TorusKnot>
        <Sphere args={[0.4, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#6D4AFF" roughness={0.1} metalness={0.8} emissive="#6D4AFF" emissiveIntensity={0.2} />
        </Sphere>
      </Float>
    </group>
  );
};

// 6. Growth & Marketing - Upward Graph
export const GrowthScene = () => {
  return (
    <group>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={1}>
        <group position={[0, -0.5, 0]}>
          {/* Bars */}
          <Cylinder args={[0.15, 0.15, 1, 32]} position={[-1, 0.5, 0]}>
            <MeshTransmissionMaterial thickness={0.5} color="#E2E8F0" transmission={0.9} roughness={0.2} />
          </Cylinder>
          <Cylinder args={[0.15, 0.15, 1.8, 32]} position={[-0.3, 0.9, 0]}>
            <MeshTransmissionMaterial thickness={0.5} color="#E2E8F0" transmission={0.9} roughness={0.2} />
          </Cylinder>
          <Cylinder args={[0.15, 0.15, 2.8, 32]} position={[0.4, 1.4, 0]}>
            <MeshTransmissionMaterial thickness={0.5} color="#E2E8F0" transmission={0.9} roughness={0.2} />
          </Cylinder>
          <Cylinder args={[0.15, 0.15, 4, 32]} position={[1.1, 2.0, 0]}>
             <meshStandardMaterial color="#6D4AFF" roughness={0.2} metalness={0.5} />
          </Cylinder>
          
          {/* Base */}
          <RoundedBox args={[3.2, 0.1, 0.8]} radius={0.05} position={[0.05, 0, 0]}>
            <meshStandardMaterial color="#F8FAFC" roughness={0.1} />
          </RoundedBox>
        </group>
      </Float>
    </group>
  );
};
