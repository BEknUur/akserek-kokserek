'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function GrassBlade({ position, height, color, rotation }: {
  position: [number, number, number]
  height: number
  color: string
  rotation: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.2 + position[0]) * 0.05
  })

  return (
    <mesh ref={ref} position={position} rotation={[0, rotation, 0]}>
      <boxGeometry args={[0.035, height, 0.035]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default function Steppe({ performanceMode = false }: { performanceMode?: boolean }) {
  const grassBlades = useMemo(() => {
    const blades: Array<{
      position: [number, number, number]
      height: number
      color: string
      rotation: number
    }> = []

    const bladeCount = performanceMode ? 90 : 260
    for (let i = 0; i < bladeCount; i++) {
      const x = (Math.random() - 0.5) * 78
      const z = (Math.random() - 0.5) * 56
      if (Math.abs(z) > 6 || Math.abs(x) > 10) {
        blades.push({
          position: [x, -0.84, z],
          height: 0.24 + Math.random() * 0.35,
          color: `hsl(${92 + Math.random() * 42}, 38%, ${27 + Math.random() * 12}%)`,
          rotation: Math.random() * Math.PI,
        })
      }
    }

    return blades
  }, [performanceMode])

  return (
    <group>
      {/* Основная земля */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="#4a6741" roughness={0.9} />
      </mesh>

      {/* Игровое поле — чуть светлее */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.99, 0]} receiveShadow>
        <planeGeometry args={[20, 14]} />
        <meshStandardMaterial color="#5a7a4a" roughness={0.8} />
      </mesh>

      {/* Центральная линия */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.98, 0]}>
        <planeGeometry args={[20, 0.05]} />
        <meshStandardMaterial color="#8a9a6a" opacity={0.6} transparent />
      </mesh>

      {/* Следы на земле */}
      {[-8, -5, -2, 2, 5, 8].map((x, index) => (
        <mesh key={index} rotation={[-Math.PI / 2, 0, 0.2]} position={[x, -0.965, -1.8 + (index % 2) * 0.6]}>
          <planeGeometry args={[0.45, 0.12]} />
          <meshStandardMaterial color="#6f7048" opacity={0.45} transparent />
        </mesh>
      ))}

      {/* Трава */}
      {grassBlades.map((blade, i) => (
        <GrassBlade key={i} {...blade} />
      ))}

      {/* Дальний план — холмы */}
      <mesh position={[0, -0.5, -50]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[30, 16, 8, 0, Math.PI * 2, 0, Math.PI / 4]} />
        <meshStandardMaterial color="#3d5a34" side={THREE.BackSide} />
      </mesh>
      <mesh position={[-40, 1, -40]}>
        <sphereGeometry args={[18, 12, 8, 0, Math.PI * 2, 0, Math.PI / 3]} />
        <meshStandardMaterial color="#4a6a3e" />
      </mesh>
      <mesh position={[35, 0, -45]}>
        <sphereGeometry args={[22, 12, 8, 0, Math.PI * 2, 0, Math.PI / 3]} />
        <meshStandardMaterial color="#3d5a34" />
      </mesh>
    </group>
  )
}
