'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function TestThree() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas
        camera={{ position: [0, 0, 2] }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial color="orange" />
        </Sphere>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
