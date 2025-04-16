"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import type * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import { Button } from "@/app/components/ui/button";
import dynamic from "next/dynamic";
import { HeroBackground3D } from "../hero-bg";
import Link from "next/link";

// This avoids SSR crash
const AnimatedBackground = dynamic(() => import("../animated-bg"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-black/50" />,
});

// function AnimatedSphere() {
//   const sphereRef = useRef<THREE.Mesh>(null)

//   useFrame(({ clock }) => {
//     if (sphereRef.current) {
//       sphereRef.current.rotation.x = clock.getElapsedTime() * 0.2
//       sphereRef.current.rotation.y = clock.getElapsedTime() * 0.3
//     }
//   })

//   return (
//     <Sphere ref={sphereRef} args={[1, 64, 64]} scale={2.5}>
//       <MeshDistortMaterial color="#a855f7" attach="material" distort={0.4} speed={2} roughness={0.2} metalness={0.8} />
//     </Sphere>
//   )
// }

export function Hero() {
  return (
    <div className="relative min-h-screen pt-20 overflow-hidden">
      {/* <AnimatedBackground /> */}
      <HeroBackground3D />

      {/* Content */}
      <div className="container mx-auto px-4 pt-28 pb-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="gradient-text">Stake USDT</span>
              <br />
              <span className="text-white">on your terms.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Go Solo or Pool with others.
            <br />
            Stake or unstake in seconds.
            <br />
            Use your stake in DeFi.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="#plans"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white px-8 py-3 text-lg rounded-full transition-opacity duration-200"
            >
              Start Staking
            </Link>
            {/* <Button
              size="lg"
              variant="outline"
              className="border-purple-500/50 hover:border-purple-500 text-white px-8 py-6 text-lg rounded-full"
            >
              Learn More
            </Button>m */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
}
