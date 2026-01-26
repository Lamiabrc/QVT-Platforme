// src/components/ZenaParticleFace.tsx
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";

function ZenaParticles() {
  const ref = useRef<THREE.Points>(null);

  // Nuage de particules écrasé pour rappeler un visage de face
  const positions = useMemo(() => {
    const count = 2500;
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // coordonnées sphériques
      const r = 1.25 + Math.random() * 0.35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      let x = r * Math.sin(phi) * Math.cos(theta);
      let y = r * Math.cos(phi);
      let z = r * Math.sin(phi) * Math.sin(theta);

      // on "aplatit" pour rappeler un visage de face
      x *= 0.65; // un peu plus étroit
      y *= 1.15; // un peu plus haut
      z *= 0.35; // peu de profondeur

      // légère zone plus dense au centre (traits du visage)
      const focus = Math.random();
      if (focus > 0.7) {
        x *= 0.5;
        y *= 0.7;
      }

      arr[i * 3 + 0] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }

    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = Math.sin(t * 0.15) * 0.25;
    ref.current.rotation.x = Math.cos(t * 0.12) * 0.1;
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      stride={3}
      frustumCulled
      rotation={[0, 0, 0]}
    >
      <PointMaterial
        transparent
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        color="#F6D69C" // doré doux
      />
    </Points>
  );
}

export default function ZenaParticleFace() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Halo doré derrière */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_10%,#FFF7E3_0,#FDE3B1_28%,#E9C38A_55%,#C59BDC_85%,#00000000_100%)] blur-3xl opacity-90 pointer-events-none" />

      {/* Disque principal (fond) */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2A1E14] via-[#120F10] to-[#050308] shadow-[0_30px_90px_rgba(0,0,0,0.55)]" />

      {/* Portrait doré en léger "soft light" */}
      <img
        src="/zena-face-golden.jpg"
        alt="ZÉNA"
        className="absolute inset-0 m-auto h-[78%] w-[78%] rounded-full object-cover opacity-90 mix-blend-soft-light"
      />

      {/* Scène 3D */}
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 45 }}
        className="relative h-full w-full"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 3, 4]} intensity={1.1} color="#F9E5B6" />
        <directionalLight position={[-3, -2, -4]} intensity={0.4} color="#C59BDC" />
        <ZenaParticles />
        {/* OrbitControls pour un léger mouvement au survol, désactivé au scroll */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      {/* Halo fin autour du disque */}
      <div className="pointer-events-none absolute inset-[-10px] rounded-full border border-[#F6D69C]/50 shadow-[0_0_40px_rgba(245,218,165,0.8)]" />
    </div>
  );
}
