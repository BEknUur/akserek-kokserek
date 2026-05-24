'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { Player as PlayerType } from '@/lib/store/types'

interface PlayerProps {
  player: PlayerType
  isHighlighted?: boolean
  isRunner?: boolean
  onClick?: () => void
}

export default function Player({ player, isHighlighted, isRunner, onClick }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const color = player.team === 'blue' ? '#1a56db' : '#e02424'
  const hatColor = player.team === 'blue' ? '#1e3a8a' : '#7f1d1d'
  const highlightColor = '#ffd700'

  useFrame((state) => {
    if (!groupRef.current) return
    if (isRunner) {
      // Бегущий игрок — прыгает
      groupRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 8)) * 0.3
    } else {
      // Стоящий — лёгкое покачивание
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + player.position) * 0.03
    }
  })

  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerOver={onClick ? (e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' } : undefined}
      onPointerOut={onClick ? () => { document.body.style.cursor = 'default' } : undefined}
    >
      {/* Тело (чапан) */}
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 0.85, 8, 16]} />
        <meshStandardMaterial
          color={isHighlighted ? highlightColor : color}
          emissive={isHighlighted ? highlightColor : '#000000'}
          emissiveIntensity={isHighlighted ? 0.3 : 0}
        />
      </mesh>

      {/* Голова */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#d4a76a" />
      </mesh>

      {/* Тюбетейка */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.14, 0.2, 0.12, 16]} />
        <meshStandardMaterial color={isHighlighted ? '#b8860b' : hatColor} />
      </mesh>

      {/* Орнамент на тюбетейке */}
      <mesh position={[0, 1.115, 0]}>
        <torusGeometry args={[0.17, 0.015, 6, 16]} />
        <meshStandardMaterial color={isHighlighted ? '#ffd700' : '#ffd700'} />
      </mesh>

      {/* Имя над головой */}
      <Text
        position={[0, 1.55, 0]}
        fontSize={0.2}
        color={isHighlighted ? '#ffd700' : 'white'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {player.name}
      </Text>

      {/* Индикатор капитана */}
      {player.isCaptain && (
        <Text
          position={[0, 1.85, 0]}
          fontSize={0.18}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
        >
          ★
        </Text>
      )}

      {/* Подсветка снизу при выделении */}
      {isHighlighted && (
        <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.5, 16]} />
          <meshStandardMaterial color="#ffd700" opacity={0.4} transparent />
        </mesh>
      )}
    </group>
  )
}
