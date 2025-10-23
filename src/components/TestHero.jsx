// src/components/TestHero.jsx
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import WorkspaceSceneDebug from "./WorkspaceSceneDebug";

function SpinningBox() {
  const ref = useRef();
  useFrame((_, dt) => {
    ref.current.rotation.x += dt * 0.9;
    ref.current.rotation.y += dt * 1.2;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial color="#ff2f92" />
    </mesh>
  );
}

export default function TestHero() {
  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "#0e1e2f",
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
          background: "#0e1e2f",
        }}
      >
        {/* Hot pink spinning cube */}
        <SpinningBox />

        {/* Debug "paper" blocks */}
        <group position={[6, 0, 0]}>
          <WorkspaceSceneDebug />
        </group>
      </Canvas>
    </section>
  );
}
