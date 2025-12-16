'use client';
import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ShaderControls } from './ShaderControls';
import './Viewer360.css';

interface Viewer360Props {
  imageSrc: string;
  exposure?: number;
  contrast?: number;
  saturation?: number;
  autoRotate?: boolean;
}

export default function Viewer360({
  imageSrc,
  exposure = 1.0,
  contrast = 1.0,
  saturation = 1.0,
  autoRotate = false
}: Viewer360Props) {
  const [shaderParams, setShaderParams] = useState({
    exposure,
    contrast,
    saturation
  });

  // Aktualizuj shadery
  useEffect(() => {
    setShaderParams({ exposure, contrast, saturation });
  }, [exposure, contrast, saturation]);

  return (
    <div className="viewer-wrapper">
      <Canvas
        camera={{ position: [0, 0, 0.1] }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
          antialias: true,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        className="viewer-canvas"
      >
        <SphereMesh imageSrc={imageSrc} shaderParams={shaderParams} />
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={0.5}
          maxDistance={5}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      <ShaderControls 
        exposure={shaderParams.exposure}
        contrast={shaderParams.contrast}
        saturation={shaderParams.saturation}
        onChange={setShaderParams}
      />
    </div>
  );
}

// GŁÓWNY KOMPONENT SFERY Z CUSTOM SHADERAMI
function SphereMesh({ imageSrc, shaderParams }: {
  imageSrc: string;
  shaderParams: { exposure: number; contrast: number; saturation: number };
}) {
  const { gl } = useThree();
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const textureRef = useRef<THREE.Texture>(null!);

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageSrc, undefined, undefined, (error) => {
      console.error('Error loading texture:', error);
    });
    
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    textureRef.current = texture;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        exposure: { value: shaderParams.exposure },
        contrast: { value: shaderParams.contrast },
        saturation: { value: shaderParams.saturation }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float exposure;
        uniform float contrast;
        uniform float saturation;
        varying vec2 vUv;
        
        void main() {
          vec4 texColor = texture2D(map, vUv);
          
          // Exposure
          texColor.rgb *= exposure;
          
          // Contrast
          texColor.rgb = (texColor.rgb - 0.9) * contrast + 0.9;
          
          // Saturation
          float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
          texColor.rgb = mix(vec3(luminance), texColor.rgb, saturation);
          
          gl_FragColor = texColor;
        }
      `,
      side: THREE.BackSide
    });

    materialRef.current = material;
    if (meshRef.current) {
      meshRef.current.material = material;
    }
  }, [imageSrc]);

  // Update shader uniforms
  useFrame(() => {
    if (materialRef.current && textureRef.current) {
      materialRef.current.uniforms.exposure.value = shaderParams.exposure;
      materialRef.current.uniforms.contrast.value = shaderParams.contrast;
      materialRef.current.uniforms.saturation.value = shaderParams.saturation;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[5, 64, 64]} />
    </mesh>
  );
}
