import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";

interface ZenaZoomIntroProps {
  onComplete: () => void;
  skipable?: boolean;
}

function FaceParticles() {
  const pointsRef = useRef<THREE.Points | null>(null);
  const [positions, setPositions] = useState<Float32Array | null>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const img = new Image();
    img.src = "/images/zena-face.png";
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const targetWidth = 180;
      const ratio = img.height / img.width;
      canvas.width = targetWidth;
      canvas.height = targetWidth * ratio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const step = 4;
      const pts: number[] = [];

      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const i = (y * canvas.width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 40) continue;

          const brightness = (r + g + b) / 3;
          if (brightness < 40) continue;

          const nx = (x / canvas.width) * 2 - 1;
          const ny = -(y / canvas.height) * 2 + 1;
          const nz = ((255 - brightness) / 255) * 0.3;

          pts.push(nx, ny, nz);
        }
      }

      setPositions(new Float32Array(pts));
    };

    img.onerror = () => {
      img.src = "/zena-face-base.png";
    };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();

    if (t < 2) {
      setOpacity(Math.min(t / 2, 1));
    } else {
      setOpacity(1);
    }

    if (t > 2) {
      const breathe = 1 + Math.sin((t - 2) * 0.8) * 0.02;
      pointsRef.current.scale.set(breathe, breathe, breathe);
    }

    pointsRef.current.rotation.y = Math.sin(t * 0.15) * 0.1;
  });

  if (!positions) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} sizeAttenuation color="#B8A2FF" transparent opacity={opacity * 0.95} />
    </points>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points | null>(null);
  const particleCount = 80;

  const positions = new Float32Array(particleCount * 3);
  const velocities = useRef<Float32Array>(new Float32Array(particleCount * 3));

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2;

    velocities.current[i * 3] = (Math.random() - 0.5) * 0.01;
    velocities.current[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
    velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
  }

  useFrame(() => {
    if (!particlesRef.current) return;

    const attrib = particlesRef.current.geometry.attributes.position;
    const arr = attrib.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] += velocities.current[i * 3];
      arr[i * 3 + 1] += velocities.current[i * 3 + 1];
      arr[i * 3 + 2] += velocities.current[i * 3 + 2];

      if (Math.abs(arr[i * 3]) > 4) arr[i * 3] *= -0.9;
      if (Math.abs(arr[i * 3 + 1]) > 3) arr[i * 3 + 1] *= -0.9;
      if (Math.abs(arr[i * 3 + 2]) > 1) arr[i * 3 + 2] *= -0.9;
    }

    attrib.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={particleCount} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.015} sizeAttenuation color="#E0D5FF" transparent opacity={0.4} />
    </points>
  );
}

function AnimatedCamera({ onComplete }: { onComplete: () => void }) {
  const [startTime] = useState(Date.now());

  useFrame(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed >= 4) {
      onComplete();
    }
  });

  return null;
}

export default function ZenaZoomIntro({ onComplete, skipable = true }: ZenaZoomIntroProps) {
  const [fadeOut, setFadeOut] = useState(false);

  const handleComplete = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 800);
  }, [onComplete]);

  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      handleComplete();
    }, 5000);

    return () => {
      clearTimeout(safetyTimer);
    };
  }, [handleComplete]);

  return (
    <motion.div className="fixed inset-0 z-50 bg-black" initial={{ opacity: 0 }} animate={{ opacity: fadeOut ? 0 : 1 }} transition={{ duration: 0.8 }}>
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 3]} intensity={1} color="#B8A2FF" />
        <pointLight position={[-3, -2, 2]} intensity={0.5} color="#E0D5FF" />

        <FaceParticles />
        <FloatingParticles />
        <AnimatedCamera onComplete={handleComplete} />
      </Canvas>

      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: fadeOut ? 0 : 1, y: fadeOut ? -20 : 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4" style={{ textShadow: "0 0 40px rgba(184, 162, 255, 0.8)" }}>
            ZÉNA
          </h1>
          <p className="text-xl text-[#E0D5FF] opacity-80">Votre compagne d'intelligence émotionnelle</p>
        </div>
      </motion.div>

      {skipable && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleComplete}
          className="absolute top-8 right-8 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all text-sm font-medium"
        >
          Passer l'intro
        </motion.button>
      )}
    </motion.div>
  );
}
