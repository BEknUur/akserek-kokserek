'use client'

import { useRef } from 'react'
import * as THREE from 'three'

function GrassBlade({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[0, Math.random() * Math.PI, 0]}>
      <boxGeometry args={[0.04, 0.3 + Math.random() * 0.2, 0.04]} />
      <meshStandardMaterial color={`hsl(${110 + Math.random() * 20}, 40%, ${28 + Math.random() * 10}%)`} />
    </mesh>
  )
}

export default function Steppe() {
  const grassPositions: [number, number, number][] = []
  for (let i = 0; i < 200; i++) {
    const x = (Math.random() - 0.5) * 60
    const z = (Math.random() - 0.5) * 40
    // Не спавним траву на игровом поле (между -8 и 8 по z, -12 и 12 по x)
    if (Math.abs(z) > 6 || Math.abs(x) > 10) {
      grassPositions.push([x, -0.85, z])
    }
  }

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

      {/* Трава */}
      {grassPositions.map((pos, i) => (
        <GrassBlade key={i} position={pos} />
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
