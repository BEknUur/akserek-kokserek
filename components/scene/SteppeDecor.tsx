'use client'

function Banner({ position, color, rotation = 0 }: {
  position: [number, number, number]
  color: string
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 1.9, 6]} />
        <meshStandardMaterial color="#6b4a2b" />
      </mesh>
      <mesh position={[0.32, 1.55, 0]}>
        <boxGeometry args={[0.62, 0.38, 0.035]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      <mesh position={[0.32, 1.55, 0.021]}>
        <boxGeometry args={[0.35, 0.06, 0.02]} />
        <meshStandardMaterial color="#d6ad36" />
      </mesh>
    </group>
  )
}

function Rug({ position, rotation = 0, color = '#8b2f2f' }: {
  position: [number, number, number]
  rotation?: number
  color?: string
}) {
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, rotation]}>
      <mesh>
        <planeGeometry args={[2.1, 1.15]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[1.45, 0.14]} />
        <meshStandardMaterial color="#d6ad36" />
      </mesh>
    </group>
  )
}

function Fence({ position, rotation = 0 }: {
  position: [number, number, number]
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[-1.6, -0.8, 0, 0.8, 1.6].map((x) => (
        <mesh key={x} position={[x, 0.35, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.9, 6]} />
          <meshStandardMaterial color="#6b4a2b" />
        </mesh>
      ))}
      <mesh position={[0, 0.58, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.032, 0.032, 3.5, 6]} />
        <meshStandardMaterial color="#6b4a2b" />
      </mesh>
    </group>
  )
}

function Kazan({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.45, 12, 8, 0, Math.PI * 2, 0, Math.PI / 1.55]} />
        <meshStandardMaterial color="#1f2325" roughness={0.65} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.025, 6, 14]} />
        <meshStandardMaterial color="#303436" metalness={0.35} />
      </mesh>
    </group>
  )
}

function Haystack({ position, scale = 1 }: {
  position: [number, number, number]
  scale?: number
}) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <coneGeometry args={[0.75, 1.1, 9]} />
      <meshStandardMaterial color="#b7984f" roughness={1} />
    </mesh>
  )
}

function Lantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 1.5, 6]} />
        <meshStandardMaterial color="#5c3c22" />
      </mesh>
      <mesh position={[0.22, 1.42, 0]}>
        <boxGeometry args={[0.22, 0.28, 0.22]} />
        <meshStandardMaterial color="#f0b84a" emissive="#c76a22" emissiveIntensity={0.6} />
      </mesh>
      <pointLight color="#f2a33a" intensity={0.45} distance={4} position={[0.22, 1.42, 0]} />
    </group>
  )
}

export default function SteppeDecor() {
  return (
    <group>
      <Banner position={[-11, -0.9, -13]} color="#1f5f8f" rotation={0.25} />
      <Banner position={[-8, -0.9, -15]} color="#8b2f2f" rotation={0.12} />
      <Banner position={[12, -0.9, -15]} color="#2f7d4f" rotation={-0.25} />
      <Rug position={[-17, -0.93, -24]} rotation={0.25} />
      <Rug position={[20, -0.93, -24]} rotation={-0.35} color="#235f7d" />
      <Fence position={[-27, -0.9, -16]} rotation={0.4} />
      <Fence position={[28, -0.9, -15]} rotation={-0.4} />
      <Kazan position={[11.2, -0.85, -10.2]} />
      <Haystack position={[24, -0.38, -20]} scale={1.1} />
      <Haystack position={[27, -0.42, -22]} scale={0.85} />
      <Lantern position={[-14, -0.9, -12]} />
      <Lantern position={[16, -0.9, -12.5]} />
      <mesh position={[-20, -0.6, -25]} rotation={[0.15, 0.4, 0.1]}>
        <boxGeometry args={[0.18, 1.15, 0.28]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      <mesh position={[-20.3, -0.02, -25.1]} rotation={[0.8, 0.1, 0.15]}>
        <boxGeometry args={[0.52, 0.09, 0.16]} />
        <meshStandardMaterial color="#d29a36" />
      </mesh>
      {[[-6, -0.8, 18], [7, -0.82, 17], [31, -0.82, -3], [-32, -0.82, -4]].map((pos, index) => (
        <mesh key={index} position={pos as [number, number, number]}>
          <dodecahedronGeometry args={[0.32 + index * 0.04, 0]} />
          <meshStandardMaterial color="#6a6b5c" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}
