'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Sky, Text } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function SteppeGround() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#4a6741" />
      </mesh>
      {/* Трава — несколько полос */}
      {[-2, -1, 0, 1, 2].map((x) =>
        [-3, -1, 1, 3].map((z) => (
          <mesh key={`g-${x}-${z}`} position={[x * 4, -0.9, z * 2]}>
            <boxGeometry args={[0.05, 0.3, 0.05]} />
            <meshStandardMaterial color="#5a7a51" />
          </mesh>
        ))
      )}
    </>
  )
}

function PreviewPlayer({
  position,
  color,
  hatColor,
  name,
}: {
  position: [number, number, number]
  color: string
  hatColor: string
  name: string
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2 + position[0]) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Тело (чапан) */}
      <mesh castShadow>
        <capsuleGeometry args={[0.25, 0.7, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Голова */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#d4a76a" />
      </mesh>
      {/* Тюбетейка */}
      <mesh position={[0, 1.02, 0]}>
        <cylinderGeometry args={[0.13, 0.18, 0.1, 16]} />
        <meshStandardMaterial color={hatColor} />
      </mesh>
      {/* Имя */}
      <Text
        position={[0, 1.4, 0]}
        fontSize={0.18}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {name}
      </Text>
    </group>
  )
}

function PreviewChain({
  players,
  color,
  z,
}: {
  players: { x: number; name: string }[]
  color: string
  z: number
}) {
  const points = players.map((p) => new THREE.Vector3(p.x, -0.1, z))

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} linewidth={2} />
    </line>
  )
}

function EaglePreview() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * 0.3
    ref.current.position.x = Math.sin(t) * 12
    ref.current.position.z = Math.cos(t) * 12
    ref.current.position.y = 8 + Math.sin(t * 2) * 0.5
    ref.current.rotation.y = -t + Math.PI / 2
  })

  return (
    <group ref={ref}>
      {/* Тело орла */}
      <mesh>
        <capsuleGeometry args={[0.2, 0.6, 4, 8]} />
        <meshStandardMaterial color="#3d2b1f" />
      </mesh>
      {/* Крылья */}
      <mesh position={[0.8, 0, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[1.2, 0.05, 0.4]} />
        <meshStandardMaterial color="#4a3525" />
      </mesh>
      <mesh position={[-0.8, 0, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[1.2, 0.05, 0.4]} />
        <meshStandardMaterial color="#4a3525" />
      </mesh>
    </group>
  )
}

function YurtPreview() {
  return (
    <group position={[-14, -1, -12]}>
      {/* Основание */}
      <mesh>
        <cylinderGeometry args={[2, 2, 1.5, 16]} />
        <meshStandardMaterial color="#c8a96e" />
      </mesh>
      {/* Купол */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[2.2, 1.8, 16]} />
        <meshStandardMaterial color="#b8955a" />
      </mesh>
    </group>
  )
}

const blueNames = ['Ерлан', 'Алмас', 'Санжар', 'Бекзат']
const redNames = ['Тимур', 'Нурлан', 'Мирас', 'Ержан']

export default function PreviewScene() {
  return (
    <Canvas
      camera={{ position: [0, 5, 16], fov: 55 }}
      shadows="soft"
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[50, 30, -20]}
        intensity={2.5}
        color="#ff8c42"
        castShadow
      />

      <Sky
        sunPosition={[100, 8, -100]}
        turbidity={10}
        rayleigh={4}
        inclination={0.49}
        azimuth={0.25}
      />

      <SteppeGround />
      <YurtPreview />
      <EaglePreview />

      {/* Синяя команда */}
      {blueNames.map((name, i) => (
        <PreviewPlayer
          key={`blue-${i}`}
          position={[(i - 1.5) * 1.8, -0.3, 3]}
          color="#1a56db"
          hatColor="#1e3a8a"
          name={name}
        />
      ))}

      {/* Красная команда */}
      {redNames.map((name, i) => (
        <PreviewPlayer
          key={`red-${i}`}
          position={[(i - 1.5) * 1.8, -0.3, -3]}
          color="#e02424"
          hatColor="#7f1d1d"
          name={name}
        />
      ))}

      {/* Цепи */}
      <PreviewChain
        players={blueNames.map((name, i) => ({ x: (i - 1.5) * 1.8, name }))}
        color="#60a5fa"
        z={3}
      />
      <PreviewChain
        players={redNames.map((name, i) => ({ x: (i - 1.5) * 1.8, name }))}
        color="#f87171"
        z={-3}
      />
    </Canvas>
  )
}
