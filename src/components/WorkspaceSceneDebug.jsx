// src/components/WorkspaceSceneDebug.jsx
import React from "react";
import { OrbitControls } from "@react-three/drei";

export default function WorkspaceSceneDebug() {
  return (
    <>
      <color attach="background" args={["#0b1020"]} />

      {/* Three colored "sheets" */}
      <mesh position={[-2.5, 0.5, 0]}>
        <boxGeometry args={[2.2, 0.2, 3]} />
        <meshBasicMaterial color="#34d399" />
      </mesh>

      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[3, 0.2, 2]} />
        <meshBasicMaterial color="#60a5fa" />
      </mesh>

      <mesh position={[2.8, -0.2, 0]}>
        <boxGeometry args={[1.8, 0.2, 2.4]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      <OrbitControls enablePan={false} />
    </>
  );
}
