"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import * as random from "maath/random";
import { useRef, useState } from "react";
import { useGesture } from "@use-gesture/react";
import { Vector3 } from "three";

const Particles = () => {
    const ref = useRef<any>(null);
    const [sphere] = useState(() =>
        new Float32Array(random.inSphere(new Float32Array(2000 * 3), { radius: 1.5 }))
    );

    useFrame((state, delta) => {
        if (ref.current && state) {
            ref.current.rotation.x += delta / 10;
            ref.current.rotation.y += delta / 15;
        }
    });

    const bind = useGesture({
        onMove: ({ xy: [x, y] }) => {
            const vec = new Vector3(
                (x / window.innerWidth) * 2 - 1,
                -(y / window.innerHeight) * 2 + 1,
                0
            );
            ref.current.position.lerp(vec.multiplyScalar(0.1), 0.1);
        }
    });

    return (
        <points ref={ref} {...bind()}>
            <Points positions={sphere} stride={3}>
                <PointMaterial
                    transparent
                    color="#8A2BE2"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={1}
                />
            </Points>
        </points>
    );
};

const ParticleField = () => (
    <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 2] }}>
            <ambientLight intensity={0.5} />
            <Particles />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
    </div>
);

export default ParticleField;