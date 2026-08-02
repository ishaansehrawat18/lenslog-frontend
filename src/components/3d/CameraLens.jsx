import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

// A stylized camera lens built from primitive shapes: a dark outer
// barrel (cylinder), a few concentric aperture rings (torus), and a
// glassy front element (sphere) that catches light nicely.
// autoRotate: whether it spins continuously (used for splash/login)
// or stays still (used mid page-transition, where the parent controls rotation).
function CameraLens({ autoRotate = true, scale = 1 }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Outer barrel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.1, 1.3, 1.4, 32]} />
        <meshStandardMaterial color="#111827" metalness={0.7} roughness={0.3} />
      </mesh>

{/* Aperture rings — each a distinct vibrant color */}
      {[
        { z: 0.55, color: "#ec4899" },
        { z: 0.35, color: "#f97316" },
        { z: 0.15, color: "#8b5cf6" },
      ].map(({ z, color }, i) => (
        <mesh key={i} position={[0, 0, z]}>
          <torusGeometry args={[0.9 - i * 0.15, 0.05, 16, 48]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Glass front element */}
      <mesh position={[0, 0, 0.75]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshPhysicalMaterial
          color="#f472b6"
          roughness={0.05}
          transmission={0.85}
          thickness={0.5}
          metalness={0}
          />
           </mesh>
         </group>
          );
           }

export default CameraLens;