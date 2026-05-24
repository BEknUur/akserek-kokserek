'use client'

import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { Team } from '@/lib/store/types'

interface ChainProps {
  team: Team
  zOffset: number
}

export default function Chain({ team, zOffset }: ChainProps) {
  const points = useMemo(() => {
    const count = team.players.length
    return team.players.map((_, i) => {
      const x = (i - (count - 1) / 2) * 2
      return new THREE.Vector3(x, 0.5, zOffset)
    })
  }, [team.players, zOffset])

  if (points.length < 2) return null

  const lineColor = team.color === 'blue' ? '#60a5fa' : '#f87171'

  return (
    <Line
      points={points}
      color={lineColor}
      lineWidth={3}
      dashed={false}
    />
  )
}
