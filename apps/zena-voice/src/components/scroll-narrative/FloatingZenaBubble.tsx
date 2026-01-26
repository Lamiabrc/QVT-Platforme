import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";

interface FloatingZenaBubbleProps {
  currentSection: string;
  scrollProgress: number;
  onClick?: () => void;
}

function ZenaSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Breathing animation
    const breathe = 1 + Math.sin(t * 0.8) * 0.05;
    meshRef.current.scale.set(breathe, breathe, breathe);

    // Gentle rotation
    meshRef.current.rotation.y = t * 0.2;

    // Pulsing light
    if (lightRef.current) {
      lightRef.current.intensity = 1 + Math.sin(t * 2) * 0.3;
    }
  });

  return (
    <>
      <pointLight ref={lightRef} position={[0, 0, 0]} intensity={1} color="#F5D091" />
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#F5D091" emissive="#C89A53" emissiveIntensity={0.4} roughness={0.2} metalness={0.8} />
      </mesh>
    </>
  );
}

function OrbitalParticles() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  const particles = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const radius = 1.8;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    particles.push(
      <mesh key={i} position={[x, 0, z]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#F7C97A" transparent opacity={0.6} />
      </mesh>
    );
  }

  return <group ref={groupRef}>{particles}</group>;
}

export default function FloatingZenaBubble({ currentSection, scrollProgress, onClick }: FloatingZenaBubbleProps) {
  // Calculate position based on section
  const getPosition = () => {
    switch (currentSection) {
      case "hero":
        return { x: "50%", y: "45%" };
      case "capacites":
        return { x: "20%", y: "50%" };
      case "comment-ca-marche":
        return { x: "80%", y: "50%" };
      case "pour-qui":
        return { x: "50%", y: "50%" };
      case "rencontrer-zena":
        return { x: "50%", y: "50%" };
      default:
        return { x: "50%", y: "50%" };
    }
  };

  const position = getPosition();
  const isRencontrerSection = currentSection === "rencontrer-zena";

  return (
    <motion.div
      className="fixed pointer-events-none z-40"
      animate={{
        left: position.x,
        top: position.y,
        scale: isRencontrerSection ? 1.5 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 50,
        damping: 20,
      }}
      style={{
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="flex flex-col items-center gap-3 pointer-events-auto">
        <motion.div className="relative w-32 h-32 md:w-40 md:h-40 cursor-pointer" onClick={onClick} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#F5D091_0%,transparent_70%)] opacity-50 blur-2xl" />

          {/* 3D Canvas */}
          <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
            <color attach="background" args={["#00000000"]} />
            <ambientLight intensity={0.5} />
            <ZenaSphere />
            <OrbitalParticles />
          </Canvas>

          {/* Hover tooltip */}
          <motion.div
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#1F1309] text-[#FDF3E0] text-sm rounded-full whitespace-nowrap opacity-0 pointer-events-none"
            whileHover={{ opacity: 1 }}
          >
            Cliquez pour parler à ZÉNA
          </motion.div>
        </motion.div>

        <button
          onClick={onClick}
          className="w-48 md:w-60 py-3 rounded-full bg-gradient-to-r from-[#F5D091] to-[#F2B679] text-[#1F1309] font-semibold text-base md:text-lg shadow-lg shadow-amber-200/40 hover:shadow-amber-200/70 transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#F5D091] focus:ring-offset-2 focus:ring-offset-white"
          aria-label="Parler à ZÉNA"
        >
          Parler à ZÉNA
        </button>
      </div>
    </motion.div>
  );
}
