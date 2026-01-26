// src/components/ZenaFaceParticles.tsx
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export default function ZenaFaceParticles() {
  const ref = useRef();
  const bubbleRef = useRef();
  const [progress, setProgress] = useState(0);

  // ⬇️ Mets ici ton image de ZENA (image en clair)
  const zenaTexture = useTexture("/zena-face.png");

  // Convert the image to particle positions
  const particles = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(zenaTexture.image, 0, 0, size, size);
    const imgData = ctx.getImageData(0, 0, size, size).data;

    const points = [];
    for (let i = 0; i < imgData.length; i += 4) {
      const alpha = imgData[i + 3];
      if (alpha > 100) {
        const x = (i / 4) % size;
        const y = Math.floor(i / 4 / size);

        points.push(
          new THREE.Vector3(
            (x - size / 2) / 40,
            -(y - size / 2) / 40,
            0
          )
        );
      }
    }
    return points;
  }, [zenaTexture]);

  // Animate the dust → face formation
  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.01;
      setProgress(Math.min(t, 1));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // Create random cloud positions
  const randomPositions = useMemo(() => {
    return particles.map(() =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      )
    );
  }, [particles]);

  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      <ambientLight intensity={0.8} />

      {/* Bubble */}
      <mesh ref={bubbleRef} scale={1 + progress * 0.2}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshPhysicalMaterial
          color="#F6EFD8"
          transmission={1}
          thickness={0.8}
          roughness={0.1}
          reflectivity={0.9}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Particles */}
      <Points ref={ref} positions={particles}>
        <PointMaterial
          transparent
          color="#F0DCA5"
          size={0.015}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      {/* Animate positions */}
      <group>
        {particles.map((p, i) => {
          const start = randomPositions[i];
          const end = p;

          const x = start.x + (end.x - start.x) * progress;
          const y = start.y + (end.y - start.y) * progress;
          const z = start.z + (end.z - start.z) * progress;

          return (
            <mesh key={i} position={[x, y, z]} />
          );
        })}
      </group>
    </Canvas>
  );
}
