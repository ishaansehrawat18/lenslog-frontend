import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import CameraLens from "./3d/CameraLens.jsx";

function SplashScreen({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black"
        >
          <div className="h-48 w-48">
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[3, 3, 3]} intensity={1.2} />
              <Suspense fallback={null}>
                <CameraLens />
              </Suspense>
            </Canvas>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-4 text-lg font-bold tracking-tight text-white"
          >
            LensLog
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashScreen;