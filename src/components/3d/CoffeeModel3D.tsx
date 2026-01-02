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
  const [isReady, setIsReady] = useState(false);
  const animationStartTime = useRef<number | null>(null);
  
  // Ease out cubic function for smooth animation
  const easeOutCubic = (t: number) => {
    return 1 - Math.pow(1 - t, 3);
  };
  
  useEffect(() => {
    // Give the model time to fully load and render before starting animation
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 300); // Delay animation start by 300ms to ensure smooth rendering
    
    return () => clearTimeout(timer);
  }, []);
  
  useFrame((state, delta) => {
    if (modelRef.current && isReady) {
      if (rollAnimation && animationProgress < 1) {
        // Slower, smoother animation with easing
        const newProgress = Math.min(animationProgress + delta * 0.35, 1);
        setAnimationProgress(newProgress);
        
        // Apply easing for smooth motion
        const easedProgress = easeOutCubic(newProgress);
        
        // Animate rotation - one full rotation (360 -> 0)
        modelRef.current.rotation.y = (1 - easedProgress) * Math.PI * 2;
        
        // Animate position with easing
        let startX, endX;
        
        if (isMobile) {
          // Mobile Animation: From left to center (0)
          startX = -30;
          endX = 0;
        } else {
          // Desktop Animation: From far left to right side
          startX = -40;
          endX = 5;
        }

        const distance = endX - startX; 
        modelRef.current.position.x = startX + (easedProgress * distance);
      } else if (!rollAnimation) {
         // Reset to center if no animation
         modelRef.current.position.x = 0;
         modelRef.current.rotation.y = 0;
         setAnimationProgress(0);
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
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
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

    // Intersection Observer to track visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the component is visible
        rootMargin: '100px' // Start loading slightly before it enters viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

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
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
      window.removeEventListener('resize', checkMobile);
    };
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
    <div ref={containerRef} className={`relative w-full h-full min-h-[400px] lg:min-h-[600px]`}>
      {!isInView ? (
        // Placeholder when not in view
        <div className="flex items-center justify-center h-full bg-transparent">
          <div className="text-[#8B6F47]/30">Loading 3D Model...</div>
        </div>
      ) : (
      <Canvas
        key={key}
        ref={canvasRef}
        orthographic
        camera={cameraSettings}
        dpr={[1, 1.5]}
        frameloop="always"
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
          setTimeout(handleModelLoad, 800); // Increased delay for smoother initial load
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
      )}
    </div>
  );
}

// End of file - Preload only
useGLTF.preload('/about%20us/coffee.glb');
