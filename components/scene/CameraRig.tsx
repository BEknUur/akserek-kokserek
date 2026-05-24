'use client'

import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GamePhase } from '@/lib/store/types'

interface CameraRigProps {
  phase: GamePhase
}

// Позиция камеры и точка взгляда для каждой фазы
const CAMERA_CONFIG: Partial<Record<GamePhase, { pos: [number, number, number]; look: [number, number, number] }>> = {
  SETUP:          { pos: [0, 5, 14],  look: [0, 0, 0] },
  ENEMY_CRY:      { pos: [0, 5, 14],  look: [0, 0, 0] },
  ENEMY_CHOOSES:  { pos: [0, 5, 14],  look: [0, 0, 0] },
  PLAYER_RUNS:         { pos: [0, 3, 10],  look: [0, 0, -3] },
  BREAKTHROUGH_ANIM:   { pos: [0, 2, 8],   look: [0, 0, -1] },
  RESULT:         { pos: [0, 4, 12],  look: [0, 0, 0] },
  COMMENTARY:     { pos: [0, 5, 14],  look: [0, 0, 0] },
  PLAYER_CHOOSES: { pos: [0, 7, 16],  look: [0, 0, 0] },
  ENEMY_RUNS:     { pos: [0, 3, -10], look: [0, 0, 3] },
  GAME_OVER:      { pos: [0, 6, 18],  look: [0, 0, 0] },
}

const DEFAULT_CONFIG = { pos: [0, 5, 14] as [number, number, number], look: [0, 0, 0] as [number, number, number] }

const targetPos = new THREE.Vector3(0, 5, 14)
const targetLook = new THREE.Vector3(0, 0, 0)
const currentLook = new THREE.Vector3(0, 0, 0)

export default function CameraRig({ phase }: CameraRigProps) {
  const { camera } = useThree()

  useFrame(() => {
    const config = CAMERA_CONFIG[phase] ?? DEFAULT_CONFIG

    targetPos.set(...config.pos)
    targetLook.set(...config.look)

    // Плавно двигаем позицию
    camera.position.lerp(targetPos, 0.05)

    // Плавно интерполируем точку взгляда и применяем lookAt
    currentLook.lerp(targetLook, 0.05)
    camera.lookAt(currentLook)
  })

  return null
}
