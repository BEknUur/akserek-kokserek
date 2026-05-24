'use client'

export default function BackgroundMountains() {
  return (
    <group>
      <mesh position={[0, 5, -86]} rotation={[0, 0.1, 0]}>
        <coneGeometry args={[32, 16, 4]} />
        <meshStandardMaterial color="#5b614f" roughness={1} />
      </mesh>
      <mesh position={[-38, 3.5, -78]} rotation={[0, -0.2, 0]}>
        <coneGeometry args={[26, 12, 4]} />
        <meshStandardMaterial color="#4f5a48" roughness={1} />
      </mesh>
      <mesh position={[42, 4, -82]} rotation={[0, 0.35, 0]}>
        <coneGeometry args={[30, 14, 4]} />
        <meshStandardMaterial color="#687055" roughness={1} />
      </mesh>
      <mesh position={[0, -0.6, -72]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[180, 45]} />
        <meshStandardMaterial color="#536644" opacity={0.45} transparent />
      </mesh>
    </group>
  )
}
