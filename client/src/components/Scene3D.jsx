import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced DNA Helix with glow effect
function DNAHelix({ position = [0, 0, 0], scale = 1, color1 = "#00bcd4", color2 = "#0066cc" }) {
  const groupRef = useRef();
  const helixPoints = useMemo(() => {
    const points = [];
    const numPoints = 60;
    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 5;
      const radius = 0.5;
      points.push({
        pos1: [Math.cos(t) * radius, (i / numPoints - 0.5) * 4, Math.sin(t) * radius],
        pos2: [Math.cos(t + Math.PI) * radius, (i / numPoints - 0.5) * 4, Math.sin(t + Math.PI) * radius],
        connector: i % 4 === 0
      });
    }
    return points;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {helixPoints.map((point, i) => (
        <group key={i}>
          {/* First strand spheres with glow */}
          <mesh position={point.pos1}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial
              color={color1}
              emissive={color1}
              emissiveIntensity={0.8}
            />
          </mesh>
          {/* Second strand spheres */}
          <mesh position={point.pos2}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial
              color={color2}
              emissive={color2}
              emissiveIntensity={0.8}
            />
          </mesh>
          {/* Glowing connectors */}
          {point.connector && (
            <mesh position={[(point.pos1[0] + point.pos2[0]) / 2, point.pos1[1], (point.pos1[2] + point.pos2[2]) / 2]}>
              <boxGeometry args={[1, 0.03, 0.03]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#00bcd4"
                emissiveIntensity={0.5}
                transparent
                opacity={0.7}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// Neural Network Nodes with connections
function NeuralNetwork({ position = [0, 0, 0] }) {
  const groupRef = useRef();
  const nodes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 20; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4
        ],
        connections: []
      });
    }
    // Create connections between nearby nodes
    for (let i = 0; i < temp.length; i++) {
      for (let j = i + 1; j < temp.length; j++) {
        const dist = Math.sqrt(
          Math.pow(temp[i].position[0] - temp[j].position[0], 2) +
          Math.pow(temp[i].position[1] - temp[j].position[1], 2) +
          Math.pow(temp[i].position[2] - temp[j].position[2], 2)
        );
        if (dist < 2) {
          temp[i].connections.push(j);
        }
      }
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {nodes.map((node, i) => (
        <group key={i}>
          {/* Node sphere */}
          <mesh position={node.position}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color="#7c3aed"
              emissive="#7c3aed"
              emissiveIntensity={0.6}
            />
          </mesh>
          {/* Connections */}
          {node.connections.map((targetIdx, j) => {
            const start = node.position;
            const end = nodes[targetIdx].position;
            const mid = [
              (start[0] + end[0]) / 2,
              (start[1] + end[1]) / 2,
              (start[2] + end[2]) / 2
            ];
            const length = Math.sqrt(
              Math.pow(end[0] - start[0], 2) +
              Math.pow(end[1] - start[1], 2) +
              Math.pow(end[2] - start[2], 2)
            );
            const direction = new THREE.Vector3(
              end[0] - start[0],
              end[1] - start[1],
              end[2] - start[2]
            ).normalize();
            const quaternion = new THREE.Quaternion().setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              direction
            );
            
            return (
              <mesh key={j} position={mid} quaternion={quaternion}>
                <cylinderGeometry args={[0.008, 0.008, length, 8]} />
                <meshStandardMaterial
                  color="#a78bfa"
                  emissive="#7c3aed"
                  emissiveIntensity={0.3}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

// Floating Medical Icons
function FloatingIcon({ position, icon, color }) {
  const meshRef = useRef();
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + offset) * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <boxGeometry args={[0.4, 0.4, 0.1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

// Pulsing Energy Wave
function EnergyWave({ position = [0, 0, 0], color = "#00bcd4" }) {
  const meshRef = useRef();
  const [scale, setScale] = useState(0);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const newScale = ((time % 4) / 4) * 3;
    setScale(newScale);
    if (meshRef.current) {
      meshRef.current.scale.setScalar(newScale);
      meshRef.current.material.opacity = 1 - (newScale / 3);
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.8, 1, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Hexagonal Grid Background
function HexGrid({ position = [0, 0, -10] }) {
  const groupRef = useRef();
  const hexagons = useMemo(() => {
    const temp = [];
    const hexRadius = 0.8;
    const hexHeight = hexRadius * Math.sqrt(3);
    for (let i = -8; i <= 8; i++) {
      for (let j = -5; j <= 5; j++) {
        const x = i * hexRadius * 1.5;
        const y = j * hexHeight + (i % 2 === 0 ? 0 : hexHeight / 2);
        temp.push({ x, y, delay: Math.random() * Math.PI * 2 });
      }
    }
    return temp;
  }, []);

  return (
    <group ref={groupRef} position={position}>
      {hexagons.map((hex, i) => (
        <HexCell key={i} position={[hex.x, hex.y, 0]} delay={hex.delay} />
      ))}
    </group>
  );
}

function HexCell({ position, delay }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.5 + 0.5;
      meshRef.current.material.opacity = 0.02 + pulse * 0.05;
      meshRef.current.material.emissiveIntensity = pulse * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <circleGeometry args={[0.4, 6]} />
      <meshStandardMaterial
        color="#0066cc"
        emissive="#00bcd4"
        emissiveIntensity={0.1}
        transparent
        opacity={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Floating Molecules with orbital electrons
function AdvancedMolecule({ position }) {
  const groupRef = useRef();
  const electronRefs = useRef([]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
    // Animate electrons
    electronRefs.current.forEach((ref, i) => {
      if (ref) {
        const speed = 1 + i * 0.3;
        const radius = 0.4 + i * 0.15;
        ref.position.x = Math.cos(state.clock.elapsedTime * speed) * radius;
        ref.position.z = Math.sin(state.clock.elapsedTime * speed) * radius;
        ref.position.y = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.1;
      }
    });
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        {/* Nucleus */}
        <Sphere args={[0.2, 32, 32]}>
          <MeshDistortMaterial
            color="#00bcd4"
            emissive="#00bcd4"
            emissiveIntensity={0.5}
            distort={0.3}
            speed={3}
          />
        </Sphere>
        
        {/* Electron orbits */}
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[i * 0.5, i * 0.8, 0]}>
            {/* Orbit ring */}
            <mesh>
              <torusGeometry args={[0.4 + i * 0.15, 0.005, 16, 100]} />
              <meshStandardMaterial
                color="#00bcd4"
                emissive="#00bcd4"
                emissiveIntensity={0.3}
                transparent
                opacity={0.3}
              />
            </mesh>
            {/* Electron */}
            <mesh ref={(el) => (electronRefs.current[i] = el)}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#00bcd4"
                emissiveIntensity={1}
              />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  );
}

// Particles System with trails
function EnhancedParticles({ count = 300 }) {
  const mesh = useRef();
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 8 + Math.random() * 5;
      temp.push({
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ],
        speed: Math.random() * 0.02 + 0.005,
        offset: Math.random() * Math.PI * 2,
        size: Math.random() * 0.03 + 0.01
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      const t = state.clock.elapsedTime * particle.speed + particle.offset;
      dummy.position.set(
        particle.position[0] + Math.sin(t * 2) * 0.3,
        particle.position[1] + Math.cos(t * 1.5) * 0.3,
        particle.position[2] + Math.sin(t * 0.5) * 0.3
      );
      dummy.scale.setScalar(particle.size + Math.sin(t * 3) * 0.005);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#00bcd4" transparent opacity={0.7} />
    </instancedMesh>
  );
}

// Glowing Orbs with pulsing effect
function PulsingOrb({ position, color = "#0066cc", size = 1 }) {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 1;
    if (meshRef.current) {
      meshRef.current.scale.setScalar(size * pulse);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(size * pulse * 1.5);
      glowRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        {/* Core */}
        <Sphere ref={meshRef} args={[size, 64, 64]}>
          <MeshDistortMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            distort={0.4}
            speed={3}
            transparent
            opacity={0.8}
          />
        </Sphere>
        {/* Glow effect */}
        <Sphere ref={glowRef} args={[size * 1.3, 32, 32]}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
          />
        </Sphere>
      </group>
    </Float>
  );
}

// Energy Rings with rotation
function EnergyRing({ position, scale = 1, color = "#00bcd4" }) {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={ringRef} position={position} scale={scale}>
      <mesh>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.8, 0.015, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <torusGeometry args={[0.6, 0.01, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

// Mouse Follow Light with enhanced effect
function MouseLight() {
  const lightRef = useRef();
  const { viewport, mouse } = useThree();

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.x = (mouse.x * viewport.width) / 2;
      lightRef.current.position.y = (mouse.y * viewport.height) / 2;
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        position={[0, 0, 5]}
        color="#00bcd4"
        intensity={2}
        distance={15}
      />
    </>
  );
}

// Floating Stethoscope representation
function MedicalSymbol({ position }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Float speed={1} floatIntensity={0.3}>
      <group ref={groupRef} position={position}>
        {/* Cross symbol */}
        <mesh>
          <boxGeometry args={[0.1, 0.5, 0.05]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[0.5, 0.1, 0.05]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Glow */}
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshBasicMaterial
            color="#ef4444"
            transparent
            opacity={0.1}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Main 3D Scene
function Scene() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 10, 5]} intensity={0.4} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.2} color="#00bcd4" />
      
      {/* Mouse-following light */}
      <MouseLight />

      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={4000}
        factor={4}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* Hexagonal Grid Background */}
      <HexGrid position={[0, 0, -15]} />

      {/* DNA Helixes */}
      <DNAHelix position={[-5, 0, -3]} scale={0.9} />
      <DNAHelix position={[5, -1, -4]} scale={0.7} color1="#7c3aed" color2="#a78bfa" />
      <DNAHelix position={[0, 2, -6]} scale={0.5} color1="#f97316" color2="#facc15" />

      {/* Neural Network */}
      <NeuralNetwork position={[-4, -2, -2]} />

      {/* Advanced Molecules */}
      <AdvancedMolecule position={[3, 2, -1]} />
      <AdvancedMolecule position={[-3, -1, 0]} />
      <AdvancedMolecule position={[0, 3, -2]} />
      <AdvancedMolecule position={[4, -2, -3]} />

      {/* Pulsing Orbs */}
      <PulsingOrb position={[-6, 3, -6]} color="#0066cc" size={0.8} />
      <PulsingOrb position={[6, -2, -5]} color="#00bcd4" size={0.6} />
      <PulsingOrb position={[0, -4, -4]} color="#7c3aed" size={0.5} />
      <PulsingOrb position={[-3, 4, -7]} color="#f97316" size={0.4} />

      {/* Energy Rings */}
      <EnergyRing position={[3, 1, -4]} scale={0.6} />
      <EnergyRing position={[-3, -2, -3]} scale={0.8} color="#7c3aed" />
      <EnergyRing position={[0, 0, -5]} scale={0.4} color="#f97316" />

      {/* Energy Waves */}
      <EnergyWave position={[0, -3, 0]} color="#00bcd4" />
      <EnergyWave position={[-4, 2, -2]} color="#7c3aed" />

      {/* Medical Symbol */}
      <MedicalSymbol position={[5, 3, -2]} />
      <MedicalSymbol position={[-5, -3, -3]} />

      {/* Enhanced Particles */}
      <EnhancedParticles count={250} />
    </>
  );
}

// Canvas Container Component
export default function Scene3D() {
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Check for mobile devices or low-powered devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = navigator.hardwareConcurrency <= 4;
    setIsLowPerformance(isMobile || isLowEndDevice);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'linear-gradient(135deg, #0a0a1a 0%, #0f1035 50%, #1a0a2e 100%)'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={isLowPerformance ? [1, 1.5] : [1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: isLowPerformance ? 'low-power' : 'high-performance'
        }}
        performance={{ min: 0.5 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
