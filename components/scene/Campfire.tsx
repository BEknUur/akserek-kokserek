'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function SmokePuff({ offset }: { offset: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime * 0.32 + offset) % 1
    ref.current.position.y = 0.7 + t * 2.2
    ref.current.position.x = Math.sin(t * Math.PI * 2 + offset) * 0.22
    ref.current.scale.setScalar(0.25 + t * 0.55)
    const material = ref.current.material as THREE.MeshStandardMaterial
    material.opacity = 0.28 * (1 - t)
  })

  return (
    <mesh ref={ref} position={[0, 0.7, 0]}>
      <sphereGeometry args={[0.22, 8, 8]} />
      <meshStandardMaterial color="#c8c0aa" transparent opacity={0.22} depthWrite={false} />
    </mesh>
  )
}

export default function Campfire({ position = [13, -0.85, -12], scale = 1 }: {
  position?: [number, number, number]
  scale?: number
}) {
  const flameRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!flameRef.current) return
    flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.16
  })

  return (
    <group position={position} scale={scale}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[
          Math.cos(i * 1.25) * 0.55,
          0,
          Math.sin(i * 1.25) * 0.55,
        ]}>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshStandardMaterial color="#58514a" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.12, 0]} rotation={[0.6, 0, 0.75]}>
        <cylinderGeometry args={[0.06, 0.08, 1.15, 8]} />
        <meshStandardMaterial color="#4a2d18" />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[0.6, 0, -0.75]}>
        <cylinderGeometry args={[0.06, 0.08, 1.15, 8]} />
        <meshStandardMaterial color="#4a2d18" />
      </mesh>
      <mesh ref={flameRef} position={[0, 0.55, 0]}>
        <coneGeometry args={[0.34, 0.95, 8]} />
        <meshStandardMaterial color="#ff8a2a" emissive="#ff5a12" emissiveIntensity={1.4} />
      </mesh>
      <pointLight color="#ff8a2a" intensity={1.8} distance={8} position={[0, 1.1, 0]} />
      <SmokePuff offset={0.1} />
      <SmokePuff offset={0.45} />
      <SmokePuff offset={0.78} />
    </group>
  )
}
