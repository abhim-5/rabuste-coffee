'use client';

import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, ContactShadows } from '@react-three/drei';
import { Loader2, AlertTriangle } from 'lucide-react';
import * as THREE from 'three';

interface CoffeeModel3DProps {
  onLoaded?: () => void;
  rollAnimation?: boolean;
}

interface CoffeeModelProps {
  rollAnimation: boolean;
  isMobile: boolean;
}

function CoffeeModel({ rollAnimation = false, isMobile = false }: CoffeeModelProps) {
  const modelRef = useRef<THREE.Group>(null);
  
  // Load the model with preload for faster loading
  const gltf = useGLTF('/about%20us/coffee.glb', true);
  
  // Roll animation state
  const [animationProgress, setAnimationProgress] = useState(0);
  
  useFrame((state, delta) => {
    if (modelRef.current) {
      if (rollAnimation && animationProgress < 1) {
        // Increment animation progress - faster speed
        const newProgress = Math.min(animationProgress + delta * 0.5, 1);
        setAnimationProgress(newProgress);
        
        // Animate rotation - one full rotation (360 -> 0)
        // Desktop: (1 - newProgress) * Math.PI * 2 (Spins while moving)
        modelRef.current.rotation.y = (1 - newProgress) * Math.PI * 2;
        
        // Animate position
        let startX, endX;
        
        if (isMobile) {
          // Mobile Animation: From left to center (0)
          startX = -30; // Start offset to left relative to center
          endX = 0;     // End at center
        } else {
          // Desktop Animation: From far left to right side
          startX = -40;
          endX = 5;
        }

        const distance = endX - startX; 
        modelRef.current.position.x = startX + (newProgress * distance);
      } else if (!rollAnimation) {
         // Reset to center if no animation
         modelRef.current.position.x = 0;
         modelRef.current.rotation.y = 0;
      }
    }
  });

  return (
    <group ref={modelRef} position={[-120, 0, 0]}>
      <primitive object={gltf.scene} scale={2} />
    </group>
  );
}

// Loader component
function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 animate-spin text-[#8B6F47]" />
    </div>
  );
}

// Error fallback component
function ErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <AlertTriangle className="w-12 h-12 text-amber-500 mb-2" />
      <p className="text-sm text-gray-600">Unable to load 3D model</p>
    </div>
  );
}

export default function CoffeeModel3D({ onLoaded, rollAnimation = false }: CoffeeModel3DProps = {}) {
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check mobile state
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Handle WebGL context loss
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setHasError(true);
      
      // Try to restore after a delay
      setTimeout(() => {
        setKey(prev => prev + 1);
        setHasError(false);
      }, 1000);
    };

    const handleContextRestored = () => {
      setHasError(false);
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);

      return () => {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
        window.removeEventListener('resize', checkMobile);
      };
    }
  }, []);

  const handleModelLoad = () => {
    setIsModelReady(true);
    if (onLoaded) {
      onLoaded();
    }
  };

  if (hasError) {
    return <ErrorFallback />;
  }

  // Camera settings based on device
  const cameraSettings = isMobile ? {
    position: [60, 10, 15] as [number, number, number], // Centered for mobile
    zoom: 120
  } : {
    position: [40, 0, 15] as [number, number, number], // Right-aligned for desktop roll
    zoom: 190
  };

  // Run animation on mobile too
  const activeRollAnimation = isMobile ? true : rollAnimation;

  return (
    <div className={`relative w-full h-full min-h-[400px] lg:min-h-[600px]`}>
      <Canvas
        key={key}
        ref={canvasRef}
        orthographic
        camera={{ ...cameraSettings }}
        dpr={[1, 1.5]}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          setTimeout(handleModelLoad, 500);
        }}
      >
        <ambientLight intensity={0.9} color="#fff5e6" />
        <directionalLight position={[5, 8, 5]} intensity={2.0} color="#ffe4b3" castShadow />
        <directionalLight position={[-4, 3, 3]} intensity={1.2} color="#ffd9a8" />
        <pointLight position={[0, 4, -4]} intensity={1.5} color="#ffcc99" />
        <spotLight position={[0, 10, 0]} angle={0.4} penumbra={1} intensity={1.2} color="#fff5e6" />

        <Suspense fallback={null}>
          <CoffeeModel rollAnimation={activeRollAnimation} isMobile={isMobile} />
        </Suspense>

        <ContactShadows position={[0, -1.2, 0]} opacity={0.7} scale={4} blur={2.1} far={4} color="rgba(18, 17, 17, 1)" />

        {/* Controls: Enabled on mobile now as requested */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true} // Enable rotation on all devices
          enableDamping={true}
          dampingFactor={0.05}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

// End of file - Preload only
useGLTF.preload('/about%20us/coffee.glb');
