import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";

interface ZenaZoomIntroProps {
  onComplete: () => void;
  skipable?: boolean;
}

// Composant pour les particules du visage (inspiré de ZenaFaceParticles)
function FaceParticles() {
  const pointsRef = useRef<THREE.Points | null>(null);
  const [positions, setPositions] = useState<Float32Array | null>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    console.log("🎬 [FaceParticles] Début du chargement de l'image");
    
    const img = new Image();
    img.src = "/images/zena-face.png";
    img.crossOrigin = "anonymous";

    img.onload = () => {
      console.log("✅ [FaceParticles] Image chargée:", img.width, "x", img.height);
      
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("❌ [FaceParticles] Impossible de créer le contexte 2D");
        return;
      }

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

      console.log("✅ [FaceParticles] Particules générées:", pts.length / 3);
      setPositions(new Float32Array(pts));
    };

    img.onerror = (error) => {
      console.error("❌ [FaceParticles] Erreur de chargement:", error);
      console.log("🔄 [FaceParticles] Tentative avec /zena-face-base.png");
      img.src = "/zena-face-base.png";
    };
  }, []);

  // Animation de fade-in progressif et breathing
  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Fade-in progressif (0-2s)
    if (t < 2) {
      setOpacity(Math.min(t / 2, 1));
    } else {
      setOpacity(1);
    }
    
    // Effet breathing subtil après 2s
    if (t > 2) {
      const breathe = 1 + Math.sin((t - 2) * 0.8) * 0.02;
      pointsRef.current.scale.set(breathe, breathe, breathe);
    }
    
    // Rotation très subtile
    pointsRef.current.rotation.y = Math.sin(t * 0.15) * 0.1;
  });

  if (!positions) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        sizeAttenuation
        color="#B8A2FF"
        transparent
        opacity={opacity * 0.95}
      />
    </points>
  );
}

// Composant pour les particules flottantes décoratives
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points | null>(null);
  const particleCount = 80;

  const positions = new Float32Array(particleCount * 3);
  const velocities = useRef<Float32Array>(new Float32Array(particleCount * 3));

  // Initialiser les positions et vélocités
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
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities.current[i * 3];
      positions[i * 3 + 1] += velocities.current[i * 3 + 1];
      positions[i * 3 + 2] += velocities.current[i * 3 + 2];
      
      // Wrap around
      if (Math.abs(positions[i * 3]) > 4) positions[i * 3] *= -0.9;
      if (Math.abs(positions[i * 3 + 1]) > 3) positions[i * 3 + 1] *= -0.9;
      if (Math.abs(positions[i * 3 + 2]) > 1) positions[i * 3 + 2] *= -0.9;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        sizeAttenuation
        color="#E0D5FF"
        transparent
        opacity={0.4}
      />
    </points>
  );
}

// Animation de la caméra (juste un léger mouvement, pas de zoom)
function AnimatedCamera({ onComplete }: { onComplete: () => void }) {
  const [startTime] = useState(Date.now());

  useFrame(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    
    // Déclencher la fin de l'intro après 4 secondes
    if (elapsed >= 4) {
      onComplete();
    }
  });

  return null;
}

export default function ZenaZoomIntro({ onComplete, skipable = true }: ZenaZoomIntroProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    console.log("🎬 [ZenaZoomIntro] Composant monté");
    
    // Timeout de sécurité : forcer la transition après 5 secondes
    const safetyTimer = setTimeout(() => {
      console.log("⏱️ [ZenaZoomIntro] Timeout de sécurité atteint (5s)");
      handleComplete();
    }, 5000);

    return () => {
      console.log("🧹 [ZenaZoomIntro] Nettoyage du timer");
      clearTimeout(safetyTimer);
    };
  }, []);

  const handleComplete = () => {
    console.log("✅ [ZenaZoomIntro] Début du fade-out");
    setFadeOut(true);
    setTimeout(() => {
      console.log("🎬 [ZenaZoomIntro] Appel de onComplete()");
      onComplete();
    }, 800);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Canvas 3D avec le visage en particules */}
      <Canvas 
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 3]} intensity={1} color="#B8A2FF" />
        <pointLight position={[-3, -2, 2]} intensity={0.5} color="#E0D5FF" />
        
        <FaceParticles />
        <FloatingParticles />
        <AnimatedCamera onComplete={handleComplete} />
      </Canvas>

      {/* Texte ZÉNA */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: fadeOut ? 0 : 1, y: fadeOut ? -20 : 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4" style={{ textShadow: '0 0 40px rgba(184, 162, 255, 0.8)' }}>
            ZÉNA
          </h1>
          <p className="text-xl text-[#E0D5FF] opacity-80">
            Votre compagne d'intelligence émotionnelle
          </p>
        </div>
      </motion.div>

      {/* Bouton Passer l'intro */}
      {skipable && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => {
            console.log("⏭️ [ZenaZoomIntro] Bouton 'Passer l'intro' cliqué");
            handleComplete();
          }}
          className="absolute top-8 right-8 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all text-sm font-medium"
        >
          Passer l'intro
        </motion.button>
      )}
    </motion.div>
  );
}
