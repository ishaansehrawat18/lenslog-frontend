import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import CameraLens from "./CameraLens.jsx";

// Full 3D scene for the Login/Register hero background: a gently
// floating, rotating lens over a starfield, lit with vibrant magenta
// and orange lights to match the colorful gradient background.
function LoginScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 3]} intensity={1.6} color="#f472b6" />
      <pointLight position={[-3, -2, 2]} intensity={1.4} color="#a855f7" />
      <pointLight position={[3, -1, -2]} intensity={1.2} color="#fb923c" />

      <Suspense fallback={null}>
        <Stars radius={30} depth={40} count={800} factor={2} saturation={0.4} fade speed={0.5} />
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
          <CameraLens scale={1.3} />
        </Float>
      </Suspense>
    </Canvas>
  );
}

export default LoginScene;