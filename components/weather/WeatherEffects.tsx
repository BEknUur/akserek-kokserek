'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '@/lib/store/gameStore'
import { resolveWeather } from '@/lib/game/weatherSystem'

function Rain() {
  const groupRef = useRef<THREE.Group>(null)
  const drops = useMemo(() => Array.from({ length: 90 }, () => [
    (Math.random() - 0.5) * 56,
    4 + Math.random() * 10,
    (Math.random() - 0.5) * 42,
  ] as [number, number, number]), [])

  useFrame(() => {
    groupRef.current?.children.forEach((child) => {
      child.position.y -= 0.22
      child.position.x -= 0.025
      if (child.position.y < -0.6) child.position.y = 12
    })
  })

  return (
    <group ref={groupRef}>
      {drops.map((position, index) => (
        <mesh key={index} position={position} rotation={[0.35, 0, 0.15]}>
          <boxGeometry args={[0.012, 0.5, 0.012]} />
          <meshStandardMaterial color="#9cc9ff" transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  )
}

function Lightning() {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    if (!lightRef.current) return
    const flash = Math.sin(state.clock.elapsedTime * 5.7) > 0.965
    lightRef.current.intensity = flash ? 8 : 0
  })

  return <pointLight ref={lightRef} position={[0, 12, -16]} color="#dbeafe" distance={80} intensity={0} />
}

export default function WeatherEffects() {
  const weather = resolveWeather(useGameStore((state) => state.weather))

  return (
    <>
      {(weather === 'rain' || weather === 'storm') && <Rain />}
      {weather === 'storm' && <Lightning />}
      {weather === 'night' && <ambientLight intensity={0.08} color="#31406f" />}
      {weather === 'fog' && <fog attach="fog" args={['#d5d0bd', 18, 58]} />}
      {weather === 'storm' && <fog attach="fog" args={['#606879', 20, 70]} />}
    </>
  )
}
