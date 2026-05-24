'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { Player as PlayerType } from '@/lib/store/types'

interface RunnerProps {
  runner: PlayerType
  targetZ: number
}

export default function Runner({ runner, targetZ }: RunnerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const progressRef = useRef(0)

  const startZ = runner.team === 'blue' ? 4 : -4
  const color = runner.team === 'blue' ? '#1a56db' : '#e02424'
  const hatColor = runner.team === 'blue' ? '#1e3a8a' : '#7f1d1d'
  const direction = runner.team === 'blue' ? -1 : 1  // blue бежит к -z, red к +z

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Плавно разгоняемся: прогресс 0→0.92 за ~1.5 сек
    progressRef.current = Math.min(progressRef.current + delta * 0.65, 0.92)
    const p = progressRef.current

    const currentZ = THREE.MathUtils.lerp(startZ, targetZ, p)
    groupRef.current.position.z = currentZ

    // Прыжки — частота зависит от скорости (kush)
    const freq = 6 + runner.kush * 0.5
    groupRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * freq)) * 0.4

    // Наклон вперёд при беге
    groupRef.current.rotation.x = direction * -0.15
    // Поворот лицом к противнику
    groupRef.current.rotation.y = runner.team === 'blue' ? Math.PI : 0
  })

  return (
    <group ref={groupRef} position={[0, 0, startZ]}>
      {/* Тело */}
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 0.85, 8, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
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

      {/* Имя — Billboard всегда смотрит на камеру, никогда не зеркалится */}
      <Billboard follow lockX={false} lockY lockZ={false}>
        <Text
          position={[0, 1.6, 0]}
          fontSize={0.22}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {runner.name}
        </Text>
      </Billboard>

      {/* Следы скорости */}
      {[0.35, 0.65, 0.95].map((offset, i) => (
        <mesh
          key={i}
          position={[0, 0.1, direction * offset * -1]}
          scale={1 - offset * 0.4}
        >
          <sphereGeometry args={[0.12, 6, 6]} />
          <meshStandardMaterial
            color={color}
            opacity={0.25 - i * 0.08}
            transparent
          />
        </mesh>
      ))}
    </group>
  )
}
