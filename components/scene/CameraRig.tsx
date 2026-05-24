'use client'

import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GamePhase } from '@/lib/store/types'

interface CameraRigProps {
  phase: GamePhase
}

const CAMERA_CONFIG: Partial<Record<GamePhase, { pos: [number, number, number]; look: [number, number, number] }>> = {
  SETUP:             { pos: [0, 5, 14],  look: [0, 0, 0] },
  PLAYER_CHOOSES:    { pos: [0, 7, 16],  look: [0, 0, 0] },
  PLAYER_RUNS:       { pos: [0, 3, 10],  look: [0, 0, -3] },
  BOT_CHOOSING:      { pos: [0, 5, 14],  look: [0, 0, 0] },
  ENEMY_RUNS:        { pos: [0, 3, -10], look: [0, 0, 3] },
  BREAKTHROUGH_ANIM: { pos: [0, 2, 8],   look: [0, 0, -1] },
  RESULT:            { pos: [0, 4, 12],  look: [0, 0, 0] },
  GAME_OVER:         { pos: [0, 6, 18],  look: [0, 0, 0] },
}

const DEFAULT = { pos: [0, 5, 14] as [number, number, number], look: [0, 0, 0] as [number, number, number] }
const targetPos  = new THREE.Vector3(0, 5, 14)
const targetLook = new THREE.Vector3(0, 0, 0)
const currentLook = new THREE.Vector3(0, 0, 0)

export default function CameraRig({ phase }: CameraRigProps) {
  const { camera } = useThree()

  useFrame(() => {
    const cfg = CAMERA_CONFIG[phase] ?? DEFAULT
    targetPos.set(...cfg.pos)
    targetLook.set(...cfg.look)
    camera.position.lerp(targetPos, 0.05)
    currentLook.lerp(targetLook, 0.05)
    camera.lookAt(currentLook)
  })

  return null
}
