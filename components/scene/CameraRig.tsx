'use client'

import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GamePhase } from '@/lib/store/types'

interface CameraRigProps {
  phase: GamePhase
}

const CAMERA_POSITIONS: Partial<Record<GamePhase, [number, number, number]>> = {
  LANDING:        [0, 8, 20],
  TUTORIAL:       [0, 8, 20],
  SETUP:          [0, 10, 22],
  ENEMY_CRY:      [0, 8, 20],
  ENEMY_CHOOSES:  [4, 4, 14],
  PLAYER_RUNS:    [0, 3, 10],
  RESULT:         [6, 5, 12],
  COMMENTARY:     [0, 8, 20],
  PLAYER_CHOOSES: [0, 14, 18],
  ENEMY_RUNS:     [0, 3, -10],
  GAME_OVER:      [0, 12, 25],
}

const LOOK_AT_POSITIONS: Partial<Record<GamePhase, [number, number, number]>> = {
  PLAYER_RUNS:   [0, 0, -2],
  ENEMY_RUNS:    [0, 0, 2],
  RESULT:        [0, 0, 0],
}

export default function CameraRig({ phase }: CameraRigProps) {
  const { camera } = useThree()
  const targetPos = new THREE.Vector3()
  const lookAtPos = new THREE.Vector3()

  useFrame(() => {
    const pos = CAMERA_POSITIONS[phase] ?? [0, 8, 20]
    const look = LOOK_AT_POSITIONS[phase] ?? [0, 0, 0]

    targetPos.set(...pos)
    lookAtPos.set(...look)

    camera.position.lerp(targetPos, 0.04)
    // Плавный lookAt через quaternion
    const dummy = new THREE.Object3D()
    dummy.position.copy(camera.position)
    dummy.lookAt(lookAtPos)
    camera.quaternion.slerp(dummy.quaternion, 0.05)
  })

  return null
}
