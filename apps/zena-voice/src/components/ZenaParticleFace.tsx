import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { AdditiveBlending, Color, ShaderMaterial, Texture } from "three";
import vertexShader from "@/shaders/zenaGoldenFace.vert.glsl?raw";
import fragmentShader from "@/shaders/zenaGoldenFace.frag.glsl?raw";

type ParticleFieldProps = {
  gridSize: number;
  span: number;
  positions: Float32Array;
  opacity: number;
};

function useGridPositions(gridSize: number, span: number) {
  return useMemo(() => {
    const total = gridSize * gridSize;
    const positions = new Float32Array(total * 3);
    let ptr = 0;

    for (let y = 0; y < gridSize; y += 1) {
      for (let x = 0; x < gridSize; x += 1) {
        const nx = x / (gridSize - 1);
        const ny = y / (gridSize - 1);
        positions[ptr++] = (nx - 0.5) * span;
        positions[ptr++] = (0.5 - ny) * span;
        positions[ptr++] = 0;
      }
    }

    return positions;
  }, [gridSize, span]);
}

function ParticleField({ gridSize, span, positions, opacity }: ParticleFieldProps) {
  const texture = useTexture("/zena-face-golden.png") as Texture;
  const materialRef = useRef<ShaderMaterial | null>(null);

  useEffect(() => {
    texture.flipY = false;
    texture.needsUpdate = true;
  }, [texture]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointSize: { value: 4.0 },
      uGridScale: { value: span },
      uFaceTexture: { value: texture },
      uThreshold: { value: 0.18 },
      uColorLight: { value: new Color("#ffe7b8") },
      uColorDark: { value: new Color("#a96b1f") },
      uOpacity: { value: opacity },
    }),
    [opacity, span, texture]
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uOpacity.value = opacity;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

export default function ZenaParticleFace() {
  const gridSize = 220;
  const span = 2.0;
  const positions = useGridPositions(gridSize, span);

  const [maskScale, setMaskScale] = useState(1);
  const [shaderOpacity, setShaderOpacity] = useState(1);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = 600;
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      setMaskScale(1 + progress * 0.4);
      setShaderOpacity(1 - progress * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = maskRef.current;
    if (!el) return;
    el.style.setProperty("--mask-scale", `${maskScale}`);
    el.style.setProperty("--mask-opacity", `${shaderOpacity}`);
  }, [maskScale, shaderOpacity]);

  return (
    <>
      <Canvas
        className="pointer-events-none zena-particle-canvas"
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ParticleField gridSize={gridSize} span={span} positions={positions} opacity={shaderOpacity} />
        </Suspense>
      </Canvas>

      <div ref={maskRef} className="zena-mask zena-mask-dynamic" />
    </>
  );
}
