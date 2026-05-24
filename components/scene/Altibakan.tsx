'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Altibakan({ position = [-18, -0.8, -18], scale = 1 }: {
  position?: [number, number, number]
  scale?: number
}) {
  const swingRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!swingRef.current) return
    swingRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.75) * 0.1
  })

  const wood = '#6b4a2b'
  const rope = '#d7bb7a'

  return (
    <group position={position} scale={scale}>
      <mesh position={[-1.8, 1.7, 0]} rotation={[0, 0, -0.28]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 4.3, 8]} />
        <meshStandardMaterial color={wood} roughness={0.85} />
      </mesh>
      <mesh position={[1.8, 1.7, 0]} rotation={[0, 0, 0.28]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 4.3, 8]} />
        <meshStandardMaterial color={wood} roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.55, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 4.3, 8]} />
        <meshStandardMaterial color={wood} roughness={0.85} />
      </mesh>

      <group ref={swingRef} position={[0, 3.4, 0]}>
        <mesh position={[-0.45, -1.25, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 2.2, 6]} />
          <meshStandardMaterial color={rope} roughness={0.9} />
        </mesh>
        <mesh position={[0.45, -1.25, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 2.2, 6]} />
          <meshStandardMaterial color={rope} roughness={0.9} />
        </mesh>
        <mesh position={[0, -2.35, 0]} castShadow>
          <boxGeometry args={[1.25, 0.14, 0.42]} />
          <meshStandardMaterial color="#8a5d32" roughness={0.75} />
        </mesh>
      </group>

      <mesh position={[-2.9, 0.35, 0.3]}>
        <capsuleGeometry args={[0.12, 0.55, 4, 8]} />
        <meshStandardMaterial color="#293145" />
      </mesh>
      <mesh position={[-2.9, 0.85, 0.3]}>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial color="#9b7045" />
      </mesh>
      <mesh position={[2.8, 0.3, -0.2]}>
        <capsuleGeometry args={[0.11, 0.48, 4, 8]} />
        <meshStandardMaterial color="#5b1f2d" />
      </mesh>
    </group>
  )
}
