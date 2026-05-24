'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Spectator({ position, color = '#334155', reaction = 'idle' }: {
  position: [number, number, number]
  color?: string
  reaction?: 'idle' | 'cheer' | 'disappointed' | 'hype'
}) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const intensity = reaction === 'hype' ? 0.22 : reaction === 'cheer' ? 0.14 : reaction === 'disappointed' ? 0.04 : 0.06
    ref.current.position.y = position[1] + Math.abs(Math.sin(state.clock.elapsedTime * 3 + position[0])) * intensity
    ref.current.rotation.z = reaction === 'disappointed' ? -0.08 : Math.sin(state.clock.elapsedTime * 2 + position[2]) * 0.03
  })

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.48, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial color="#9b7045" />
      </mesh>
      <mesh position={[-0.18, 0.55, 0]} rotation={[0, 0, reaction === 'cheer' || reaction === 'hype' ? 0.9 : 0.2]}>
        <boxGeometry args={[0.08, 0.38, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.18, 0.55, 0]} rotation={[0, 0, reaction === 'cheer' || reaction === 'hype' ? -0.9 : -0.2]}>
        <boxGeometry args={[0.08, 0.38, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}
