'use client'

import { Vector3 } from '@react-three/fiber'

interface YurtProps {
  position?: Vector3
  scale?: number
}

export default function Yurt({ position = [0, 0, 0], scale = 1 }: YurtProps) {
  const s = scale

  return (
    <group position={position as [number, number, number]}>
      {/* Основание-цилиндр */}
      <mesh position={[0, -0.25 * s, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2 * s, 2 * s, 1.5 * s, 20]} />
        <meshStandardMaterial color="#c8a96e" roughness={0.7} />
      </mesh>

      {/* Купол */}
      <mesh position={[0, 1 * s, 0]} castShadow>
        <coneGeometry args={[2.3 * s, 2 * s, 20]} />
        <meshStandardMaterial color="#b8955a" roughness={0.8} />
      </mesh>

      {/* Навершие */}
      <mesh position={[0, 2.1 * s, 0]}>
        <cylinderGeometry args={[0.25 * s, 0.35 * s, 0.3 * s, 12]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>

      {/* Дверной проём */}
      <mesh position={[0, -0.35 * s, 2.01 * s]}>
        <boxGeometry args={[0.8 * s, 1.1 * s, 0.05 * s]} />
        <meshStandardMaterial color="#7a5c2e" roughness={0.6} />
      </mesh>

      {/* Орнаментальные полосы на боку */}
      <mesh position={[0, 0.5 * s, 0]}>
        <cylinderGeometry args={[2.01 * s, 2.01 * s, 0.12 * s, 20]} />
        <meshStandardMaterial color="#d4a935" />
      </mesh>
      <mesh position={[0, -0.3 * s, 0]}>
        <cylinderGeometry args={[2.01 * s, 2.01 * s, 0.1 * s, 20]} />
        <meshStandardMaterial color="#d4a935" />
      </mesh>
    </group>
  )
}
