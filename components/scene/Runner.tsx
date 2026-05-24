'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { Player as PlayerType, GamePhase } from '@/lib/store/types'

interface RunnerProps {
  runner: PlayerType
  targetZ: number
  phase: GamePhase
  success?: boolean
  onAnimDone?: () => void  // вызывается когда анимация прорыва/отскока закончена
}

type AnimStage = 'approach' | 'impact' | 'breakthrough' | 'bounce' | 'done'

export default function Runner({ runner, targetZ, phase, success, onAnimDone }: RunnerProps) {
  const groupRef  = useRef<THREE.Group>(null)
  const progressRef = useRef(0)          // 0..1 → startZ → targetZ
  const stageRef = useRef<AnimStage>('approach')
  const doneFired = useRef(false)

  const startZ   = runner.team === 'blue' ? 4 : -4
  const chainZ   = targetZ                          // z цепи противника
  const beyondZ  = runner.team === 'blue' ? chainZ - 5 : chainZ + 5  // насквозь
  const color    = runner.team === 'blue' ? '#1a56db' : '#e02424'
  const hatColor = runner.team === 'blue' ? '#1e3a8a' : '#7f1d1d'

  // Сброс при смене runner
  useEffect(() => {
    progressRef.current = 0
    stageRef.current = 'approach'
    doneFired.current = false
  }, [runner.id, phase])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const g = groupRef.current

    const isRunPhase   = phase === 'PLAYER_RUNS' || phase === 'ENEMY_RUNS'
    const isAnimPhase  = phase === 'BREAKTHROUGH_ANIM'

    // ── APPROACH: бежим к цепи ────────────────────────────────────────
    if (stageRef.current === 'approach' && isRunPhase) {
      progressRef.current = Math.min(progressRef.current + delta * 0.7, 0.88)
      // При phase BREAKTHROUGH_ANIM добегаем до цепи
    }

    if (stageRef.current === 'approach' && isAnimPhase) {
      // Быстро добегаем до самой цепи (0.88 → 1.0)
      progressRef.current = Math.min(progressRef.current + delta * 2.5, 1.0)
      if (progressRef.current >= 1.0) {
        stageRef.current = success ? 'breakthrough' : 'bounce'
        progressRef.current = 1.0
      }
    }

    // ── BREAKTHROUGH: проходим сквозь ────────────────────────────────
    if (stageRef.current === 'breakthrough') {
      progressRef.current = Math.min(progressRef.current + delta * 1.5, 1.4)
      if (progressRef.current >= 1.4 && !doneFired.current) {
        doneFired.current = true
        onAnimDone?.()
      }
    }

    // ── BOUNCE: отскок назад ─────────────────────────────────────────
    if (stageRef.current === 'bounce') {
      progressRef.current = Math.max(progressRef.current - delta * 1.8, 0.3)
      if (progressRef.current <= 0.3 && !doneFired.current) {
        doneFired.current = true
        onAnimDone?.()
      }
    }

    const p = progressRef.current

    // Позиция по Z (lerp + экстраполяция для breakthrough)
    let currentZ: number
    if (stageRef.current === 'breakthrough' && p > 1.0) {
      currentZ = THREE.MathUtils.lerp(chainZ, beyondZ, (p - 1.0) / 0.4)
    } else {
      currentZ = THREE.MathUtils.lerp(startZ, chainZ, Math.min(p, 1.0))
    }
    g.position.z = currentZ

    // Прыжки при беге
    const isMoving = stageRef.current === 'approach' || stageRef.current === 'breakthrough'
    g.position.y = isMoving ? Math.abs(Math.sin(state.clock.elapsedTime * 8)) * 0.38 : 0

    // Наклон вперёд при беге
    g.rotation.x = isMoving ? (runner.team === 'blue' ? -0.15 : 0.15) : 0
    g.rotation.y = runner.team === 'blue' ? Math.PI : 0

    // Вспышка при прорыве
    const mat = (g.children[0] as THREE.Mesh)?.material as THREE.MeshStandardMaterial
    if (mat && stageRef.current === 'breakthrough' && p < 1.1) {
      mat.emissiveIntensity = THREE.MathUtils.lerp(0.2, 1.5, (p - 1.0) / 0.1)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, startZ]}>
      {/* Тело */}
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 0.85, 8, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      {/* Голова */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#d4a76a" />
      </mesh>
      {/* Тюбетейка */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.14, 0.2, 0.12, 16]} />
        <meshStandardMaterial color={hatColor} />
      </mesh>

      {/* Имя — Billboard */}
      <Billboard follow lockX={false} lockY lockZ={false}>
        <Text
          position={[0, 1.65, 0]}
          fontSize={0.22}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {runner.name}
        </Text>
      </Billboard>

      {/* Следы скорости */}
      {[0.3, 0.6, 0.95].map((off, i) => (
        <mesh key={i} position={[0, 0.1, (runner.team === 'blue' ? 1 : -1) * off]} scale={1 - off * 0.4}>
          <sphereGeometry args={[0.12, 6, 6]} />
          <meshStandardMaterial color={color} opacity={0.22 - i * 0.06} transparent />
        </mesh>
      ))}
    </group>
  )
}
