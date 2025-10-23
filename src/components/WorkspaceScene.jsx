// src/components/WorkspaceScene.jsx
import React, { useRef, useMemo, useState, Suspense } from "react"
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, RoundedBox, ContactShadows, Html, RectAreaLight } from "@react-three/drei"
import { EffectComposer, Selection, Select, Outline, SSAO, Noise, Vignette } from "@react-three/postprocessing"
import { easing } from "maath"

// ---------------- Paper Toon Ramp ----------------
function usePaperRamp(colors = ["#f5f2eb", "#e7e1d7", "#d8d1c6", "#c9c1b5"]) {
  // Small 1x4 gradient used by MeshToonMaterial to get papery steps
  return useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = colors.length
    canvas.height = 1
    const ctx = canvas.getContext("2d")
    colors.forEach((c, i) => {
      ctx.fillStyle = c
      ctx.fillRect(i, 0, 1, 1)
    })
    const tex = new THREE.CanvasTexture(canvas)
    tex.magFilter = THREE.NearestFilter
    tex.minFilter = THREE.NearestFilter
    tex.generateMipmaps = false
    return tex
  }, [colors])
}

const COLORS = {
  bg: "#f6f3ed",
  wall: "#eee8de",
  desk: "#f2ede4",
  note: "#f7e1a2",
  label: "#847d74",
  outline: "#bfb6aa",
}

// ---------------- Parallax (semi-locked) ----------------
function ParallaxRig({ children }) {
  const group = useRef()
  const base = new THREE.Vector3(0, 2.7, 7.6)
  useFrame((state, dt) => {
    const { camera, pointer } = state
    const px = THREE.MathUtils.clamp(pointer.x, -1, 1)
    const py = THREE.MathUtils.clamp(pointer.y, -1, 1)
    const yaw = THREE.MathUtils.clamp(px * 0.16, -0.16, 0.16)
    const pitch = THREE.MathUtils.clamp(-py * 0.09, -0.09, 0.09)
    easing.dampE(group.current.rotation, new THREE.Euler(pitch, yaw, 0), 0.22, dt)
    const camTarget = new THREE.Vector3(base.x + px * 0.28, base.y - py * 0.22, base.z)
    easing.damp3(camera.position, camTarget, 0.22, dt)
    camera.lookAt(0, 1.05, 0)
  })
  return <group ref={group}>{children}</group>
}

// ---------------- Hover + label ----------------
function Hoverable({ children, label, labelOffset = [0, 0.22, 0], scale = 1.06 }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  useFrame((_, dt) => {
    const t = hovered ? scale : 1
    easing.damp3(ref.current.scale, [t, t, t], 0.25, dt)
  })
  return (
    <Select enabled={hovered}>
      <group
        ref={ref}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
      >
        {children}
        {label && (
          <Html
            position={labelOffset}
            center
            style={{
              fontFamily: "ui-sans-serif, system-ui",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: COLORS.label,
              opacity: hovered ? 1 : 0,
              transition: "opacity 160ms ease",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {label}
          </Html>
        )}
      </group>
    </Select>
  )
}

// ---------------- Papercraft materials ----------------
function PaperToon({ color, gradientMap }) {
  return <meshToonMaterial color={color} gradientMap={gradientMap} />
}

// ---------------- Objects ----------------
function BackWall({ ramp }) {
  return (
    <RoundedBox args={[12, 7, 0.18]} position={[0, 2.6, -2.6]} radius={0.25} smoothness={6} receiveShadow>
      <PaperToon color={COLORS.wall} gradientMap={ramp} />
    </RoundedBox>
  )
}

function PaperDesk({ ramp }) {
  return (
    <RoundedBox args={[10, 0.16, 4.8]} position={[0, 0.0, 0]} radius={0.24} smoothness={8} castShadow receiveShadow>
      <PaperToon color={COLORS.desk} gradientMap={ramp} />
    </RoundedBox>
  )
}

function PaperLaptop({ position, ramp }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.9, 0.02, 1.25]} radius={0.06} smoothness={6} castShadow receiveShadow>
        <PaperToon color="#f3efe6" gradientMap={ramp} />
      </RoundedBox>
      <mesh position={[0, 0.02, 0.06]} castShadow>
        <boxGeometry args={[1.5, 0.004, 0.9]} />
        <PaperToon color="#efece5" gradientMap={ramp} />
      </mesh>
      <group position={[0, 0.02, -0.62]} rotation={[Math.PI * 0.95, 0, 0]}>
        <RoundedBox args={[1.9, 0.02, 1.25]} radius={0.06} smoothness={6} castShadow>
          <PaperToon color="#f3efe6" gradientMap={ramp} />
        </RoundedBox>
        <mesh position={[0, 0.018, -0.06]}>
          <boxGeometry args={[1.6, 0.002, 1.0]} />
          <PaperToon color="#e8e5dd" gradientMap={ramp} />
        </mesh>
      </group>
    </group>
  )
}

function PaperNotebook({ position, ramp }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.3, 0.01, 0.95]} radius={0.04} smoothness={6} castShadow receiveShadow>
        <PaperToon color="#f3efe6" gradientMap={ramp} />
      </RoundedBox>
      <mesh position={[0.02, 0.008, 0]}>
        <boxGeometry args={[1.26, 0.002, 0.92]} />
        <PaperToon color="#ffffff" gradientMap={ramp} />
      </mesh>
      <mesh position={[-0.64, 0.009, 0]}>
        <boxGeometry args={[0.06, 0.004, 0.94]} />
        <PaperToon color="#e9e4da" gradientMap={ramp} />
      </mesh>
    </group>
  )
}

function PaperMug({ position, ramp }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.26, 0.36, 24]} />
        <PaperToon color="#f0ece3" gradientMap={ramp} />
      </mesh>
      <mesh position={[0.32, 0, 0]}>
        <torusGeometry args={[0.16, 0.035, 12, 28]} />
        <PaperToon color="#f0ece3" gradientMap={ramp} />
      </mesh>
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.21, 0.21, 0.004, 24]} />
        <PaperToon color="#ded8cf" gradientMap={ramp} />
      </mesh>
    </group>
  )
}

function StickyNote({ position, ramp }) {
  return (
    <Float rotationIntensity={0.05} floatIntensity={0.04} speed={1}>
      <RoundedBox args={[0.5, 0.004, 0.5]} position={position} radius={0.02} smoothness={6} castShadow>
        <PaperToon color={COLORS.note} gradientMap={ramp} />
      </RoundedBox>
    </Float>
  )
}

// ---------------- Scene ----------------
function SceneContent() {
  const ramp = usePaperRamp()

  return (
    <>
      <color attach="background" args={[COLORS.bg]} />

      {/* Lights: soft key + cool fill; area light to get planar gradients */}
      <hemisphereLight intensity={0.55} groundColor="#f0ece4" color="#ffffff" />
      <directionalLight position={[6, 8, 6]} intensity={0.9} castShadow />
      <directionalLight position={[-6, 4, 2]} intensity={0.25} />
      <RectAreaLight
        position={[-3, 3.5, 3]}
        width={5}
        height={3}
        intensity={2.0}
        color={"#ffffff"}
        lookAt={[0, 1.2, 0]}
      />

      <BackWall ramp={ramp} />

      <Selection>
        <ParallaxRig>
          <group position={[0, 0.6, 0]}>
            <PaperDesk ramp={ramp} />

            <Hoverable label="Ideas">
              <PaperLaptop position={[-1.7, 0.18, 0.25]} ramp={ramp} />
            </Hoverable>

            <Hoverable label="Notes">
              <PaperNotebook position={[0.35, 0.19, 0.2]} ramp={ramp} />
            </Hoverable>

            <Hoverable label="Tasks" scale={1.08}>
              <PaperMug position={[1.8, 0.3, -0.35]} ramp={ramp} />
            </Hoverable>

            <StickyNote position={[0.1, 0.33, -0.85]} ramp={ramp} />
          </group>
        </ParallaxRig>

        {/* Grounding shadow (keep light) */}
        <ContactShadows position={[0, 0.01, 0]} opacity={0.18} scale={12} blur={2.2} far={4} resolution={1024} />

        {/* Paper edge outline + depth and grain */}
        <EffectComposer multisampling={4}>
          <SSAO samples={16} radius={0.12} intensity={24} luminanceInfluence={0.6} />
          <Outline
            visibleEdgeColor={COLORS.outline}
            hiddenEdgeColor={COLORS.outline}
            edgeStrength={2.2}
            width={0.006}
            xRay={false}
          />
          <Noise premultiply opacity={0.08} />      {/* subtle paper grain */}
          <Vignette eskil={false} offset={0.25} darkness={0.35} />
        </EffectComposer>
      </Selection>
    </>
  )
}

export default function WorkspaceScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2.7, 7.6], fov: 38 }}
      gl={{ antialias: true, alpha: false }}
      style={{ height: "100%", width: "100%", background: COLORS.bg }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}
