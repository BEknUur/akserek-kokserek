'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { Team, Player } from '@/lib/store/types'

interface ChainProps {
  team: Team
  zOffset: number
  brokenBetween?: { left: Player; right: Player }  // разрыв между этими двумя
  isBroken?: boolean  // фаза RESULT + success
}

function ChainFlash({ x, z }: { x: number; z: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * 8
    ref.current.scale.setScalar(1 + Math.sin(t) * 0.4)
    ;(ref.current.material as THREE.MeshStandardMaterial).opacity = 0.5 + Math.sin(t) * 0.4
  })
  return (
    <mesh ref={ref} position={[x, 0.5, z]}>
      <sphereGeometry args={[0.35, 10, 10]} />
      <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={2} transparent opacity={0.8} />
    </mesh>
  )
}

export default function Chain({ team, zOffset, brokenBetween, isBroken }: ChainProps) {
  const count = team.players.length

  const allPoints = useMemo(() =>
    team.players.map((_, i) => {
      const x = (i - (count - 1) / 2) * 2
      return new THREE.Vector3(x, 0.5, zOffset)
    }),
    [team.players, count, zOffset]
  )

  if (allPoints.length < 2) return null

  const lineColor = team.color === 'blue' ? '#60a5fa' : '#f87171'

  // Находим индекс разрыва
  let breakIdx = -1
  if (isBroken && brokenBetween) {
    const li = team.players.findIndex(p => p.id === brokenBetween.left.id)
    const ri = team.players.findIndex(p => p.id === brokenBetween.right.id)
    if (li !== -1 && ri !== -1) {
      breakIdx = Math.min(li, ri)
    }
  }

  // Если нет разрыва — рисуем одну линию
  if (breakIdx === -1) {
    return (
      <Line
        points={allPoints}
        color={lineColor}
        lineWidth={3}
        dashed={false}
      />
    )
  }

  // Если разрыв — левая часть, правая часть, и вспышка посередине
  const leftPoints = allPoints.slice(0, breakIdx + 1)
  const rightPoints = allPoints.slice(breakIdx + 1)

  const gapX = (allPoints[breakIdx].x + allPoints[breakIdx + 1].x) / 2

  return (
    <>
      {leftPoints.length >= 2 && (
        <Line points={leftPoints} color={lineColor} lineWidth={3} />
      )}
      {rightPoints.length >= 2 && (
        <Line points={rightPoints} color={lineColor} lineWidth={3} />
      )}
      {/* Вспышка в точке разрыва */}
      <ChainFlash x={gapX} z={zOffset} />
    </>
  )
}
