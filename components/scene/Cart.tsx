'use client'

export default function Cart({ position = [18, -0.55, -20], rotation = -0.35, scale = 1 }: {
  position?: [number, number, number]
  rotation?: number
  scale?: number
}) {
  const wood = '#79512f'

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.45, 1.25]} />
        <meshStandardMaterial color={wood} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.28, -0.58]} castShadow>
        <boxGeometry args={[2.7, 0.35, 0.12]} />
        <meshStandardMaterial color="#5b3a22" />
      </mesh>
      <mesh position={[0, 0.28, 0.58]} castShadow>
        <boxGeometry args={[2.7, 0.35, 0.12]} />
        <meshStandardMaterial color="#5b3a22" />
      </mesh>
      <mesh position={[0, -0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 3.2, 8]} />
        <meshStandardMaterial color="#3f2919" />
      </mesh>
      {[-1.05, 1.05].map((x) => (
        <group key={x} position={[x, -0.35, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.42, 0.065, 6, 16]} />
            <meshStandardMaterial color="#3a2416" roughness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.08, 8]} />
            <meshStandardMaterial color="#8a613a" />
          </mesh>
        </group>
      ))}
      <mesh position={[0.4, 0.55, 0]} castShadow>
        <boxGeometry args={[0.7, 0.42, 0.65]} />
        <meshStandardMaterial color="#b88743" roughness={0.75} />
      </mesh>
      <mesh position={[-0.45, 0.5, 0.05]} rotation={[0.2, 0.1, 0]} castShadow>
        <boxGeometry args={[0.8, 0.25, 0.72]} />
        <meshStandardMaterial color="#8b2f2a" roughness={0.8} />
      </mesh>
      <mesh position={[1.85, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 2.2, 8]} />
        <meshStandardMaterial color="#5b3a22" />
      </mesh>
    </group>
  )
}
