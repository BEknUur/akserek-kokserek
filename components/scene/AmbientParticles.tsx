'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Bird({ offset }: { offset: number }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * 0.16 + offset
    ref.current.position.set(Math.sin(t) * 34, 8 + Math.sin(t * 2.1) * 1.2, -34 + Math.cos(t) * 11)
    ref.current.rotation.y = -t
  })

  return (
    <group ref={ref}>
      <mesh position={[-0.18, 0, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.42, 0.025, 0.08]} />
        <meshStandardMaterial color="#2f2922" />
      </mesh>
      <mesh position={[0.18, 0, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.42, 0.025, 0.08]} />
        <meshStandardMaterial color="#2f2922" />
      </mesh>
    </group>
  )
}

export default function AmbientParticles() {
  const dust = useMemo(() => {
    return Array.from({ length: 46 }, () => ({
      position: [
        (Math.random() - 0.5) * 70,
        0.15 + Math.random() * 2.2,
        (Math.random() - 0.5) * 42,
      ] as [number, number, number],
      speed: 0.12 + Math.random() * 0.22,
      size: 0.035 + Math.random() * 0.055,
    }))
  }, [])

  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.12) * 1.4
    groupRef.current.children.forEach((child, index) => {
      child.position.x += dust[index].speed * 0.012
      if (child.position.x > 36) child.position.x = -36
    })
  })

  return (
    <group>
      <group ref={groupRef}>
        {dust.map((particle, index) => (
          <mesh key={index} position={particle.position}>
            <sphereGeometry args={[particle.size, 6, 6]} />
            <meshStandardMaterial color="#d6b57a" transparent opacity={0.24} depthWrite={false} />
          </mesh>
        ))}
      </group>
      <Bird offset={0} />
      <Bird offset={1.8} />
      <Bird offset={3.4} />
    </group>
  )
}
