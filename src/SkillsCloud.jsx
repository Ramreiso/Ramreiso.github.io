import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Float, OrbitControls, Sparkles } from '@react-three/drei';

const tierColors = ['#67e8f9', '#38bdf8', '#fbbf24'];

function createFallbackTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#164e63');
  gradient.addColorStop(1, '#0f172a');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.38, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(125, 211, 252, 0.68)';
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.fillStyle = '#67e8f9';
  ctx.beginPath();
  ctx.moveTo(size / 2, size * 0.26);
  ctx.lineTo(size * 0.72, size / 2);
  ctx.lineTo(size / 2, size * 0.74);
  ctx.lineTo(size * 0.28, size / 2);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function useSkillTextures(skills) {
  return useMemo(() => {
    const loader = new THREE.TextureLoader();

    return skills.map((skill) => {
      if (!skill.icon) {
        return createFallbackTexture();
      }

      const texture = loader.load(skill.icon);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      return texture;
    });
  }, [skills]);
}

function useSkillNodes(skills) {
  return useMemo(() => {
    const tiers = [
      { y: 0.88, radius: 2.05, start: -0.32 },
      { y: 0, radius: 2.42, start: 0.16 },
      { y: -0.88, radius: 2.16, start: 0.52 },
    ];

    return skills.map((skill, index) => {
      const tier = index % tiers.length;
      const tierItems = skills.filter((_, skillIndex) => skillIndex % tiers.length === tier);
      const tierPosition = Math.floor(index / tiers.length);
      const angle = tiers[tier].start + (tierPosition / tierItems.length) * Math.PI * 2;
      const radius = tiers[tier].radius;

      return {
        ...skill,
        angle,
        color: tierColors[tier],
        position: [
          Math.cos(angle) * radius,
          tiers[tier].y,
          Math.sin(angle) * radius,
        ],
        tier,
      };
    });
  }, [skills]);
}

function AmbientParticles() {
  const pointsRef = useRef();
  const positions = useMemo(() => {
    const count = 280;
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.3 + Math.random() * 2.3;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2.8;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }

    return arr;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.035;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.035;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#7dd3fc" size={0.014} transparent opacity={0.58} sizeAttenuation />
    </points>
  );
}

function ConstellationLines({ nodes }) {
  const positions = useMemo(() => {
    const vertices = [];

    nodes.forEach((node, index) => {
      const next = nodes[(index + 3) % nodes.length];
      vertices.push(...node.position, ...next.position);

      if (index % 2 === 0) {
        vertices.push(0, 0, 0, ...node.position);
      }
    });

    return new Float32Array(vertices);
  }, [nodes]);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#38bdf8" transparent opacity={0.13} />
    </lineSegments>
  );
}

function OrbitRings() {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.22) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.48, 0.007, 16, 180]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.48} />
      </mesh>
      <mesh rotation={[Math.PI / 2.8, Math.PI / 8, Math.PI / 5]}>
        <torusGeometry args={[2.08, 0.005, 16, 180]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.25} />
      </mesh>
      <mesh rotation={[Math.PI / 1.9, -Math.PI / 5, Math.PI / 2.6]}>
        <torusGeometry args={[1.62, 0.005, 16, 180]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function StackCore() {
  const coreRef = useRef();
  const wireRef = useRef();

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.x = state.clock.elapsedTime * 0.22;
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.32;
    }

    if (wireRef.current) {
      wireRef.current.rotation.x = -state.clock.elapsedTime * 0.16;
      wireRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float floatIntensity={0.18} rotationIntensity={0.12} speed={1.2}>
      <group>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.62, 2]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#0891b2"
            emissiveIntensity={0.28}
            metalness={0.55}
            roughness={0.28}
          />
        </mesh>
        <mesh ref={wireRef}>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.34} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.82, 0]}>
          <circleGeometry args={[0.94, 96]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.08} />
        </mesh>
      </group>
    </Float>
  );
}

function SkillNode({ node, texture, activeSkill, setActiveSkill }) {
  const groupRef = useRef();
  const isActive = activeSkill === node.label;

  useFrame((state) => {
    if (!groupRef.current) return;

    const scale = THREE.MathUtils.lerp(groupRef.current.scale.x, isActive ? 1.04 : 0.84, 0.12);
    groupRef.current.scale.setScalar(scale);
    groupRef.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime * 1.05 + node.angle) * 0.032;
  });

  return (
    <group
      ref={groupRef}
      position={node.position}
      onPointerOver={(event) => {
        event.stopPropagation();
        setActiveSkill(node.label);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setActiveSkill(null);
      }}
    >
      <Billboard>
        <group>
          <mesh position={[0, 0, -0.03]}>
            <planeGeometry args={[0.68, 0.68]} />
            <meshStandardMaterial
              color={isActive ? '#0e7490' : '#0b1220'}
              emissive={node.color}
              emissiveIntensity={isActive ? 0.22 : 0.08}
              roughness={0.48}
              metalness={0.24}
              transparent
              opacity={0.88}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <circleGeometry args={[0.26, 48]} />
            <meshBasicMaterial color="#e0f2fe" transparent opacity={isActive ? 0.14 : 0.08} />
          </mesh>
          <mesh position={[0, 0, 0.055]}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshBasicMaterial map={texture} transparent toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.3, 0.04]}>
            <planeGeometry args={[0.3, 0.01]} />
            <meshBasicMaterial color={node.color} transparent opacity={isActive ? 0.9 : 0.42} />
          </mesh>
        </group>
      </Billboard>
    </group>
  );
}

export default function SkillsCloud({ skills }) {
  const [activeSkill, setActiveSkill] = useState(null);
  const orbitRef = useRef();
  const textures = useSkillTextures(skills);
  const nodes = useSkillNodes(skills);

  useFrame((state) => {
    if (!orbitRef.current) return;
    orbitRef.current.rotation.y = state.clock.elapsedTime * 0.11;
  });

  return (
    <>
      <color attach="background" args={['#07111f']} />
      <fog attach="fog" args={['#07111f', 6.6, 11.2]} />
      <ambientLight intensity={0.68} />
      <directionalLight position={[4, 5, 4]} intensity={1.25} />
      <pointLight position={[-3.5, 2.4, 2.5]} color="#67e8f9" intensity={1.3} />
      <pointLight position={[3.2, -1.2, 2.4]} color="#fbbf24" intensity={0.75} />
      <Sparkles count={36} scale={[5.3, 2.8, 5.3]} size={0.95} speed={0.2} color="#7dd3fc" opacity={0.28} />
      <AmbientParticles />
      <OrbitRings />
      <StackCore />
      <group ref={orbitRef}>
        <ConstellationLines nodes={nodes} />
        {nodes.map((node, index) => (
          <SkillNode
            key={node.label}
            node={node}
            texture={textures[index]}
            activeSkill={activeSkill}
            setActiveSkill={setActiveSkill}
          />
        ))}
      </group>
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.55}
        rotateSpeed={0.7}
      />
    </>
  );
}
