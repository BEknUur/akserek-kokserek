'use client'

export default function FestivalDecor() {
  return (
    <group>
      {[-18, -12, -6, 6, 12, 18].map((x, index) => (
        <group key={x} position={[x, 0.1, -18]}>
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.025, 0.03, 1.6, 6]} />
            <meshStandardMaterial color="#6b4a2b" />
          </mesh>
          <mesh position={[0.32, 1.35, 0]} rotation={[0, 0, Math.sin(index) * 0.08]}>
            <boxGeometry args={[0.55, 0.28, 0.03]} />
            <meshStandardMaterial color={index % 2 === 0 ? '#8b2f2f' : '#d6ad36'} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
