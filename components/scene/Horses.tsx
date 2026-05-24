'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Horse({ position, rotation = 0, color = '#5a3925' }: {
  position: [number, number, number]
  rotation?: number
  color?: string
}) {
  const headRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!headRef.current) return
    headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.06
  })

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.65, 0]} castShadow>
        <capsuleGeometry args={[0.28, 1.1, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      <group ref={headRef} position={[0.78, 0.95, 0]}>
        <mesh rotation={[0, 0, -0.35]} castShadow>
          <capsuleGeometry args={[0.15, 0.5, 4, 8]} />
          <meshStandardMaterial color={color} roughness={0.75} />
        </mesh>
        <mesh position={[0.22, 0.25, 0]}>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
      {[-0.38, 0.38].flatMap((x) => [-0.18, 0.18].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 0.02, z]}>
          <cylinderGeometry args={[0.045, 0.055, 1.1, 6]} />
          <meshStandardMaterial color="#2d1c14" />
        </mesh>
      )))}
      <mesh position={[-0.72, 0.72, 0]} rotation={[0, 0, 0.7]}>
        <coneGeometry args={[0.07, 0.65, 6]} />
        <meshStandardMaterial color="#221611" />
      </mesh>
      <mesh position={[-0.05, 1.0, 0]}>
        <boxGeometry args={[0.62, 0.08, 0.42]} />
        <meshStandardMaterial color="#8b2f2f" />
      </mesh>
    </group>
  )
}

export default function Horses() {
  return (
    <group>
      <Horse position={[-24, -0.82, -7]} rotation={0.65} color="#65422c" />
      <Horse position={[-27, -0.82, -10]} rotation={0.45} color="#3d2a20" />
      <Horse position={[25, -0.82, -8]} rotation={-0.9} color="#8a613c" />
    </group>
  )
}
