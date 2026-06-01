import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Text, Preload, Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import gsap from 'gsap'
import * as THREE from 'three'
import './App.css'

function HeroStructure({ onReveal }) {
  const structure = useRef()
  const laser = useRef()
  const projection = useRef()
  const edgeGlow = useRef()
  const logo = useRef()
  const particles = useRef()

  const particlePositions = useMemo(() => {
    const count = 650
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = Math.random() * 2.6 - 0.4
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [])

  useEffect(() => {
    if (!structure.current || !laser.current || !projection.current || !edgeGlow.current || !logo.current) return

    gsap.set(structure.current.scale, { x: 0.08, y: 0.08, z: 0.08 })
    gsap.set(logo.current.scale, { x: 0.02, y: 0.02, z: 0.02 })
    gsap.set(projection.current.material, { opacity: 0 })
    gsap.set(edgeGlow.current.scale, { x: 0.01, y: 0.01, z: 0.01 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.to(structure.current.scale, { x: 1, y: 1, z: 1, duration: 1.9 })
      .fromTo(
        laser.current.position,
        { x: -4.5 },
        { x: 4.5, duration: 1.6, delay: 0.35 }
      )
      .to(projection.current.material, { opacity: 0.9, duration: 1.4 }, '<0.6')
      .to(edgeGlow.current.scale, { x: 1, y: 1, z: 1, duration: 1.2 }, '<0.8')
      .to(logo.current.scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: 'elastic.out(1, 0.75)' }, '<0.4')
      .call(onReveal, [], '>-0.2')
  }, [onReveal])

  useFrame((state, delta) => {
    if (structure.current) {
      structure.current.rotation.y += delta * 0.03
      structure.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.05
    }
    if (laser.current) {
      laser.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.9) * 0.04
    }
    if (particles.current) {
      particles.current.rotation.y += delta * 0.02
    }
  })

  return (
    <group ref={structure} position={[0, -0.75, 0]}>
      <group ref={particles} position={[0, -0.4, 0]}>
        <Points positions={particlePositions} stride={3} frustumCulled={false}>
          <PointMaterial transparent size={0.018} color="#52f0ff" opacity={0.35} sizeAttenuation />
        </Points>
      </group>

      <mesh position={[0, 0.12, 0.05]} rotation={[0, 0.12, 0]}>
        <boxGeometry args={[3.8, 0.4, 1.6]} />
        <meshStandardMaterial color="#09141d" metalness={0.65} roughness={0.18} emissive="#051222" emissiveIntensity={0.4} />
      </mesh>

      <mesh position={[-1.4, 0.2, 0.4]}>
        <boxGeometry args={[0.5, 1.4, 0.5]} />
        <meshStandardMaterial color="#0d233d" metalness={0.55} roughness={0.2} emissive="#05122b" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[1.35, 0.2, 0.4]}>
        <boxGeometry args={[0.5, 1.4, 0.5]} />
        <meshStandardMaterial color="#0d233d" metalness={0.55} roughness={0.2} emissive="#05122b" emissiveIntensity={0.35} />
      </mesh>

      <mesh position={[0, 0.7, -0.2]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[2.2, 0.6, 0.8]} />
        <meshStandardMaterial color="#112042" metalness={0.65} roughness={0.18} emissive="#04141f" emissiveIntensity={0.45} />
      </mesh>

      <mesh ref={projection} position={[0, -0.1, 0.83]} rotation={[0, 0, 0]}> 
        <planeGeometry args={[3.9, 1.55]} />
        <meshStandardMaterial color="#44c2ff" emissive="#44c2ff" emissiveIntensity={1.4} transparent opacity={0.0} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={laser} position={[-4.5, 0.22, 0.74]} rotation={[0, 0, 0.1]}> 
        <boxGeometry args={[9.4, 0.05, 0.02]} />
        <meshBasicMaterial color="#73f0ff" transparent opacity={0.5} />
      </mesh>

      <group ref={edgeGlow}>
        <mesh position={[0, 0.12, 0.05]}>
          <boxGeometry args={[3.84, 0.44, 1.64]} />
          <meshStandardMaterial color="#2d6bff" transparent opacity={0.18} metalness={0.8} roughness={0.1} emissive="#5af0ff" emissiveIntensity={0.45} />
        </mesh>
      </group>

      <group ref={logo} position={[0, 0.5, 0.9]} rotation={[0, 0, 0]}>
        <Text fontSize={0.33} letterSpacing={-0.04} color="#73f0ff" anchorX="center" anchorY="middle">
          DreamCatchers
          <meshStandardMaterial emissive="#76f4ff" emissiveIntensity={1.2} color="#c2f1ff" />
        </Text>
        <Text position={[0, -0.33, 0]} fontSize={0.12} letterSpacing={0.06} color="#d7f7ff" anchorX="center" anchorY="middle">
          Studios
          <meshStandardMaterial emissive="#85e7ff" emissiveIntensity={0.9} color="#eafcff" />
        </Text>
      </group>
    </group>
  )
}

function HeroScene({ onReady }) {
  return (
    <>
      <color attach="background" args={[0x03050c]} />
      <fog attach="fog" args={[0x03050c, 2, 18]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 6, 6]} intensity={1.2} color="#b6e5ff" />
      <spotLight position={[-6, 4, 5]} angle={0.32} penumbra={0.5} intensity={2} color="#a9d6ff" castShadow />
      <spotLight position={[6, 4, 5]} angle={0.28} penumbra={0.4} intensity={1.25} color="#7b8fff" />
      <HeroStructure onReveal={onReady} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]}>
        <planeGeometry args={[35, 35]} />
        <meshStandardMaterial color="#04070f" roughness={0.8} metalness={0.13} />
      </mesh>
      <mesh position={[0, -0.02, 2.2]} rotation={[Math.PI / 2, 0, 0]}> 
        <planeGeometry args={[12, 7]} />
        <meshBasicMaterial color="#3c8eff" transparent opacity={0.08} />
      </mesh>
      <EffectComposer>
        <Bloom intensity={1.2} kernelSize={5} luminanceThreshold={0.17} luminanceSmoothing={0.4} />
      </EffectComposer>
      <Preload all />
    </>
  )
}

function App() {
  const [showCTA, setShowCTA] = useState(false)

  return (
    <div className="hero-page">
      <Canvas className="hero-canvas" camera={{ position: [0, 1.5, 8.5], fov: 34, near: 0.1, far: 50 }}>
        <HeroScene onReady={() => setShowCTA(true)} />
      </Canvas>

      <div className="hero-overlay">
        <div className="hero-copy">
          <span className="hero-eyebrow">DreamCatchers Studios</span>
          <h1 className="hero-title">WE CREATE EXPERIENCES PEOPLE NEVER FORGET.</h1>
          <p className="hero-subtitle">
            Projection Mapping • 3D Animation • VR Experiences • Light & Sound Shows
          </p>
          <button className={`hero-cta ${showCTA ? 'visible' : ''}`}>View Experiences</button>
        </div>
      </div>

      <div className="hero-gradient hero-gradient-top" />
      <div className="hero-gradient hero-gradient-bottom" />
    </div>
  )
}

export default App
