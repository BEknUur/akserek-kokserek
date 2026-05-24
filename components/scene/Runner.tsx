'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { Player as PlayerType } from '@/lib/store/types'

interface RunnerProps {
  runner: PlayerType
  targetZ: number  // Z позиция цепи противника
  progress: number  // 0..1 — как далеко добежал
}

export default function Runner({ runner, targetZ, progress }: RunnerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const startZ = runner.team === 'blue' ? 4 : -4
  const color = runner.team === 'blue' ? '#1a56db' : '#e02424'
  const hatColor = runner.team === 'blue' ? '#1e3a8a' : '#7f1d1d'

  useFrame((state) => {
    if (!groupRef.current) return
    // Позиция по Z — от своей линии к цепи противника
    const currentZ = THREE.MathUtils.lerp(startZ, targetZ, progress)
    groupRef.current.position.z = currentZ
    // Прыжки при беге
    groupRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 9)) * 0.35
    // Поворот в сторону движения
    groupRef.current.rotation.y = runner.team === 'blue' ? Math.PI : 0
  })

  return (
    <group ref={groupRef} position={[0, 0, startZ]}>
      {/* Тело */}
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 0.85, 8, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} />
      </mesh>
      {/* Голова */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#d4a76a" />
      </mesh>
      {/* Тюбетейка */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.14, 0.2, 0.12, 16]} />
        <meshStandardMaterial color={hatColor} />
      </mesh>
      {/* Имя */}
      <Text
        position={[0, 1.55, 0]}
        fontSize={0.22}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {runner.name}
      </Text>
      {/* След (частицы скорости) */}
      {[0.3, 0.6, 0.9].map((offset, i) => (
        <mesh
          key={i}
          position={[0, 0, runner.team === 'blue' ? offset : -offset]}
          scale={1 - offset * 0.5}
        >
          <sphereGeometry args={[0.15, 6, 6]} />
          <meshStandardMaterial
            color={color}
            opacity={0.3 - offset * 0.25}
            transparent
          />
        </mesh>
      ))}
    </group>
  )
}
