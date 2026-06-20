import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

function OrbitRings() {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.28;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
  });

  return (
    <group ref={groupRef} position={[0.05, 0.08, -0.08]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.28, 0.01, 12, 140]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.34} />
      </mesh>
      <mesh rotation={[Math.PI / 2.35, 0.5, 0.2]}>
        <torusGeometry args={[1.02, 0.008, 12, 140]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.22} />
      </mesh>
      <mesh rotation={[Math.PI / 1.85, -0.4, 1.1]}>
        <torusGeometry args={[0.76, 0.007, 12, 140]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.24} />
      </mesh>
    </group>
  );
}

function CodePanel({ position, rotation, color = '#67e8f9', delay = 0 }) {
  const groupRef = useRef();
  const bars = useMemo(() => [0.58, 0.42, 0.72, 0.34], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.35 + delay) * 0.035;
    groupRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.65 + delay) * 0.05;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[0.94, 0.62]} />
        <meshStandardMaterial color="#07111f" emissive={color} emissiveIntensity={0.08} roughness={0.42} metalness={0.2} transparent opacity={0.78} />
      </mesh>
      {bars.map((width, index) => (
        <mesh key={width + index} position={[-0.34 + width / 2, 0.2 - index * 0.13, 0.012]}>
          <planeGeometry args={[width, 0.035]} />
          <meshBasicMaterial color={index === 0 ? color : '#dbeafe'} transparent opacity={index === 0 ? 0.75 : 0.3} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingLaptop() {
  const laptopRef = useRef();
  const screenRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (laptopRef.current) {
      laptopRef.current.rotation.y = -0.34 + Math.sin(t * 0.55) * 0.08;
      laptopRef.current.rotation.x = 0.16 + Math.sin(t * 0.4) * 0.03;
    }

    if (screenRef.current) {
      screenRef.current.rotation.x = -0.18 + Math.sin(t * 0.8) * 0.018;
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = 0.14 + Math.sin(t * 2.2) * 0.04;
    }
  });

  return (
    <Float floatIntensity={0.34} rotationIntensity={0.08} speed={1.2}>
      <group ref={laptopRef} position={[0.18, -0.18, 0]} rotation={[0.16, -0.34, 0]}>
        <mesh position={[0, -0.34, 0]} rotation={[-0.24, 0, 0]}>
          <boxGeometry args={[1.72, 0.08, 1.04]} />
          <meshStandardMaterial color="#111827" roughness={0.44} metalness={0.45} />
        </mesh>

        <mesh position={[0, -0.3, 0.18]} rotation={[-0.24, 0, 0]}>
          <boxGeometry args={[0.52, 0.012, 0.28]} />
          <meshBasicMaterial color="#7dd3fc" transparent opacity={0.16} />
        </mesh>

        <group ref={screenRef} position={[0, 0.18, -0.42]} rotation={[-0.18, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.62, 1.04, 0.07]} />
            <meshStandardMaterial color="#0f172a" roughness={0.36} metalness={0.38} />
          </mesh>
          <mesh position={[0, 0, 0.041]}>
            <planeGeometry args={[1.42, 0.82]} />
            <meshStandardMaterial color="#07111f" emissive="#0ea5e9" emissiveIntensity={0.16} roughness={0.2} />
          </mesh>
          <mesh ref={glowRef} position={[0, 0.02, 0.044]}>
            <planeGeometry args={[1.1, 0.42]} />
            <meshBasicMaterial color="#67e8f9" transparent opacity={0.16} />
          </mesh>
          <mesh position={[-0.26, 0.18, 0.046]}>
            <planeGeometry args={[0.66, 0.035]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.28} />
          </mesh>
          <mesh position={[-0.38, 0.02, 0.046]}>
            <planeGeometry args={[0.42, 0.03]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.46} />
          </mesh>
          <mesh position={[0.18, -0.08, 0.046]}>
            <planeGeometry args={[0.78, 0.03]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.42} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.78} />
      <directionalLight position={[3, 5, 4]} intensity={1.18} />
      <pointLight position={[-2.2, 1.8, 2.4]} color="#67e8f9" intensity={1.2} />
      <pointLight position={[2.2, -0.6, 2.2]} color="#fbbf24" intensity={0.55} />
      <OrbitRings />
      <FloatingLaptop />
      <CodePanel position={[-1.02, 0.54, -0.1]} rotation={[0.02, 0.42, -0.05]} color="#67e8f9" delay={0.3} />
      <CodePanel position={[1.02, 0.22, -0.22]} rotation={[0.04, -0.56, 0.06]} color="#fbbf24" delay={1.5} />
    </>
  );
}
