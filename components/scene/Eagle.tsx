'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Eagle() {
  const ref = useRef<THREE.Group>(null)
  const wingL = useRef<THREE.Mesh>(null)
  const wingR = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * 0.25
    ref.current.position.x = Math.sin(t) * 18
    ref.current.position.z = Math.cos(t) * 18
    ref.current.position.y = 10 + Math.sin(t * 3) * 0.6
    ref.current.rotation.y = -t + Math.PI / 2

    // Взмахи крыльев
    const flap = Math.sin(state.clock.elapsedTime * 3) * 0.4
    if (wingL.current) wingL.current.rotation.z = flap
    if (wingR.current) wingR.current.rotation.z = -flap
  })

  return (
    <group ref={ref}>
      {/* Тело */}
      <mesh>
        <capsuleGeometry args={[0.18, 0.55, 4, 8]} />
        <meshStandardMaterial color="#3d2b1f" />
      </mesh>
      {/* Голова */}
      <mesh position={[0, 0.45, 0.1]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color="#f5e6c8" />
      </mesh>
      {/* Клюв */}
      <mesh position={[0, 0.42, 0.22]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.04, 0.12, 6]} />
        <meshStandardMaterial color="#d4a020" />
      </mesh>
      {/* Левое крыло */}
      <mesh ref={wingL} position={[0.7, 0.05, 0]} rotation={[0, 0, 0.25]}>
        <boxGeometry args={[1.1, 0.04, 0.45]} />
        <meshStandardMaterial color="#4a3525" />
      </mesh>
      {/* Правое крыло */}
      <mesh ref={wingR} position={[-0.7, 0.05, 0]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[1.1, 0.04, 0.45]} />
        <meshStandardMaterial color="#4a3525" />
      </mesh>
      {/* Хвост */}
      <mesh position={[0, -0.35, -0.2]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.3, 0.04, 0.35]} />
        <meshStandardMaterial color="#3d2b1f" />
      </mesh>
    </group>
  )
}
