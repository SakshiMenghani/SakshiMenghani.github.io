import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const SKIN = '#f0c3a4'
const HAIR = '#1d1220'
const TOP = '#6b4cff'

const lerp = THREE.MathUtils.lerp

function usePointer() {
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return pointer
}

function Eye({ x, irisRef, lidRef }) {
  return (
    <group position={[x, 0.08, 0.83]}>
      <mesh>
        <sphereGeometry args={[0.135, 32, 32]} />
        <meshStandardMaterial color="#fffaf6" roughness={0.25} />
      </mesh>
      <group ref={irisRef}>
        <mesh position={[0, 0, 0.1]}>
          <sphereGeometry args={[0.078, 32, 32]} />
          <meshStandardMaterial color="#3a2417" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.145]}>
          <sphereGeometry args={[0.042, 24, 24]} />
          <meshStandardMaterial color="#050307" roughness={0.1} />
        </mesh>
        <mesh position={[0.025, 0.03, 0.175]}>
          <sphereGeometry args={[0.016, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      {/* deep enough on z to swallow the iris when closed */}
      <mesh ref={lidRef} scale={[1, 0, 1.45]} visible={false}>
        <sphereGeometry args={[0.148, 32, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
    </group>
  )
}

function Character({ state }) {
  const pointer = usePointer()
  const root = useRef()
  const head = useRef()
  const irisL = useRef()
  const irisR = useRef()
  const lidL = useRef()
  const lidR = useRef()
  const mouth = useRef()
  const browL = useRef()
  const browR = useRef()
  const nextBlink = useRef(2)
  const blinkEnd = useRef(0)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const { x, y } = pointer.current
    const speaking = state.current.speaking
    const thinking = state.current.thinking

    head.current.rotation.y = lerp(head.current.rotation.y, x * 0.45, 0.06)
    head.current.rotation.x = lerp(head.current.rotation.x, -y * 0.25 + (thinking ? -0.12 : 0), 0.06)
    head.current.rotation.z = lerp(head.current.rotation.z, thinking ? 0.12 : Math.sin(t * 0.8) * 0.03, 0.05)
    root.current.rotation.y = lerp(root.current.rotation.y, x * 0.15, 0.04)
    root.current.position.y = Math.sin(t * 1.4) * 0.03

    for (const iris of [irisL.current, irisR.current]) {
      iris.position.x = lerp(iris.position.x, thinking ? 0.03 : x * 0.035, 0.15)
      iris.position.y = lerp(iris.position.y, thinking ? 0.04 : y * 0.03, 0.15)
    }

    if (t > nextBlink.current) {
      blinkEnd.current = t + 0.14
      nextBlink.current = t + 2 + Math.random() * 3.5
    }
    const blink = t < blinkEnd.current
    for (const lid of [lidL.current, lidR.current]) {
      lid.scale.y = lerp(lid.scale.y, blink ? 1 : 0, blink ? 0.6 : 0.35)
      lid.visible = lid.scale.y > 0.04
    }

    const talk = speaking ? 0.35 + Math.abs(Math.sin(t * 17) * Math.sin(t * 5.3)) * 1.1 : 0.22
    mouth.current.scale.y = lerp(mouth.current.scale.y, talk, 0.35)
    mouth.current.scale.x = lerp(mouth.current.scale.x, speaking ? 0.85 : 1, 0.2)

    const browLift = speaking ? Math.sin(t * 4) * 0.015 + 0.02 : thinking ? 0.04 : 0
    browL.current.position.y = lerp(browL.current.position.y, 0.31 + browLift, 0.1)
    browR.current.position.y = lerp(browR.current.position.y, 0.31 + (thinking ? 0.0 : browLift), 0.1)
  })

  return (
    <group ref={root} position={[0, 0.05, 0]}>
      {/* torso & shoulders */}
      <mesh position={[0, -2.05, 0]}>
        <cylinderGeometry args={[0.72, 1.05, 1.5, 48]} />
        <meshStandardMaterial color={TOP} roughness={0.55} />
      </mesh>
      <mesh position={[0, -1.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.42, 0.75, 12, 32]} />
        <meshStandardMaterial color={TOP} roughness={0.55} />
      </mesh>
      {/* glowing pendant */}
      <mesh position={[0, -1.55, 0.5]}>
        <octahedronGeometry args={[0.07, 0]} />
        <meshStandardMaterial color="#7ef9ff" emissive="#7ef9ff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.24, 0.3, 0.55, 32]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
      {/* long hair falling behind the shoulders */}
      <mesh position={[0, -0.75, -0.38]} scale={[1.05, 1.5, 0.45]}>
        <sphereGeometry args={[0.95, 40, 40]} />
        <meshStandardMaterial color={HAIR} roughness={0.75} />
      </mesh>

      <group ref={head}>
        <group scale={[0.93, 1.04, 0.95]}>
          <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial color={SKIN} roughness={0.55} />
          </mesh>
          {/* hair cap with a side part */}
          <mesh rotation={[-0.22, 0, 0.08]}>
            <sphereGeometry args={[1.07, 64, 32, 0, Math.PI * 2, 0, 1.02]} />
            <meshStandardMaterial color={HAIR} roughness={0.7} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <sphereGeometry args={[1.08, 64, 32, Math.PI, Math.PI, 0, Math.PI * 0.82]} />
            <meshStandardMaterial color={HAIR} roughness={0.75} side={THREE.DoubleSide} />
          </mesh>
          {/* side locks framing the face */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.88, -0.3, -0.05]} rotation={[0, 0, s * 0.12]} scale={[0.22, 0.8, 0.3]}>
              <sphereGeometry args={[1, 24, 24]} />
              <meshStandardMaterial color={HAIR} roughness={0.75} />
            </mesh>
          ))}
          {/* earrings */}
          {[-1, 1].map((s) => (
            <mesh key={`ring${s}`} position={[s * 0.95, -0.32, 0.33]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial color="#ffd27a" emissive="#ffb84d" emissiveIntensity={0.8} metalness={0.8} roughness={0.2} />
            </mesh>
          ))}

          <Eye x={-0.33} irisRef={irisL} lidRef={lidL} />
          <Eye x={0.33} irisRef={irisR} lidRef={lidR} />

          <mesh ref={browL} position={[-0.33, 0.31, 0.92]} rotation={[0, -0.3, Math.PI / 2 - 0.12]}>
            <capsuleGeometry args={[0.024, 0.18, 4, 12]} />
            <meshStandardMaterial color={HAIR} />
          </mesh>
          <mesh ref={browR} position={[0.33, 0.31, 0.92]} rotation={[0, 0.3, Math.PI / 2 + 0.12]}>
            <capsuleGeometry args={[0.024, 0.18, 4, 12]} />
            <meshStandardMaterial color={HAIR} />
          </mesh>

          {/* nose */}
          <mesh position={[0, -0.12, 0.98]} scale={[0.07, 0.08, 0.07]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#e8ad8d" roughness={0.6} />
          </mesh>
          {/* mouth */}
          <mesh ref={mouth} position={[0, -0.38, 0.92]} scale={[1, 0.22, 1]}>
            <sphereGeometry args={[0.13, 32, 16]} />
            <meshStandardMaterial color="#b0345a" roughness={0.4} />
          </mesh>
          {/* cheeks */}
          {[-1, 1].map((s) => (
            <mesh key={`cheek${s}`} position={[s * 0.5, -0.2, 0.86]} rotation={[0, s * 0.55, 0]}>
              <circleGeometry args={[0.12, 24]} />
              <meshBasicMaterial color="#ff7a9a" transparent opacity={0.35} depthWrite={false} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}

function HoloRings({ state }) {
  const rings = useRef([])
  const mats = useRef([])
  const idle = useMemo(() => new THREE.Color('#7ef9ff'), [])
  const busy = useMemo(() => new THREE.Color('#ff8fe0'), [])

  useFrame((_, delta) => {
    const active = state.current.speaking || state.current.thinking
    const speed = active ? 1.6 : 0.45
    rings.current.forEach((r, i) => {
      if (!r) return
      r.rotation.z += delta * speed * (i % 2 ? -1 : 1) * (0.6 + i * 0.25)
    })
    mats.current.forEach((m) => m && m.color.lerp(active ? busy : idle, 0.05))
  })

  const config = [
    { r: 1.75, tilt: [1.3, 0.2, 0], y: -0.3 },
    { r: 2.0, tilt: [1.45, -0.35, 0], y: -0.6 },
    { r: 2.3, tilt: [1.2, 0.4, 0], y: -1.1 },
  ]
  return config.map((c, i) => (
    <mesh key={i} ref={(el) => (rings.current[i] = el)} position={[0, c.y, 0]} rotation={c.tilt}>
      <torusGeometry args={[c.r, 0.008, 8, 160, Math.PI * (1.2 + i * 0.25)]} />
      <meshBasicMaterial ref={(el) => (mats.current[i] = el)} color="#7ef9ff" transparent opacity={0.75} toneMapped={false} />
    </mesh>
  ))
}

function DataOrbs() {
  const group = useRef()
  const orbs = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        angle: (i / 7) * Math.PI * 2,
        radius: 2.3 + (i % 3) * 0.25,
        y: -0.6 + Math.sin(i * 1.7) * 0.9,
        size: 0.05 + (i % 3) * 0.025,
        color: ['#7ef9ff', '#b69cff', '#ff8fe0'][i % 3],
      })),
    [],
  )
  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.25
  })
  return (
    <group ref={group}>
      {orbs.map((o, i) => (
        <mesh key={i} position={[Math.cos(o.angle) * o.radius, o.y, Math.sin(o.angle) * o.radius]}>
          <icosahedronGeometry args={[o.size, 0]} />
          <meshStandardMaterial color={o.color} emissive={o.color} emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function Frame() {
  const { camera } = useThree()
  useEffect(() => {
    camera.lookAt(0, 0.22, 0)
  }, [camera])
  return null
}

export default function AvatarScene({ state }) {
  const calm = prefersReducedMotion()
  return (
    <Canvas
      camera={{ position: [0, 0.35, 4.15], fov: 32 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <Frame />
      <hemisphereLight args={['#ffe8d4', '#1b1520', 0.85]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[0.2, 1.4, 4.2]} intensity={2.4} color="#fff6ea" />
      <directionalLight position={[3, 3, 2]} intensity={1.1} color="#fff1e6" />
      <pointLight position={[-2.5, 1.2, 2]} intensity={18} color="#7ef9ff" />
      <pointLight position={[2.8, 0.2, 1.4]} intensity={16} color="#ff6fd8" />
      <Float speed={calm ? 0 : 1.1} rotationIntensity={calm ? 0 : 0.05} floatIntensity={calm ? 0 : 0.18}>
        <Character state={state} />
      </Float>
      <HoloRings state={state} />
      <DataOrbs />
      {!calm && <Sparkles count={48} scale={[5.5, 4.2, 3.5]} size={2} speed={0.3} color="#c9b8ff" />}
    </Canvas>
  )
}
