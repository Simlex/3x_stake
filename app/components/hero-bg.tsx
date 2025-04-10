"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useMotionValue, useSpring, useTransform } from "framer-motion"
import { MathUtils } from "three"
import { Environment } from "@react-three/drei"
import * as THREE from "three"

// Particle component for the background
function Particles({ count = 200, mouseX, mouseY }: { count: number; mouseX: any; mouseY: any }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const { viewport } = useThree()

  // Transform mouse position to rotation
  const rotY = useTransform(mouseX, [-1, 1], [-0.1, 0.1])
  const rotX = useTransform(mouseY, [-1, 1], [0.1, -0.1])

  useFrame((state) => {
    if (!mesh.current) return

    // Slowly rotate the entire particle system
    mesh.current.rotation.y = MathUtils.lerp(
      mesh.current.rotation.y,
      state.clock.getElapsedTime() * 0.05 + rotY.get(),
      0.01,
    )
    mesh.current.rotation.x = MathUtils.lerp(mesh.current.rotation.x, rotX.get(), 0.01)
  })

  // Create particles on mount
  useEffect(() => {
    if (!mesh.current) return

    const tempObject = new THREE.Object3D()
    const tempColor = new THREE.Color()

    for (let i = 0; i < count; i++) {
      // Position particles in a sphere
      const radius = Math.random() * 4 + 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      tempObject.position.set(x, y, z)

      // Random scale for each particle
      const scale = Math.random() * 0.2 + 0.05
      tempObject.scale.set(scale, scale, scale)
      tempObject.updateMatrix()

      // Set the matrix of the instance
      mesh.current.setMatrixAt(i, tempObject.matrix)

      // Set random colors with a purple/pink gradient
      const hue = MathUtils.lerp(0.7, 0.9, Math.random()) // Purple to pink hue range
      const saturation = MathUtils.lerp(0.5, 0.8, Math.random())
      const lightness = MathUtils.lerp(0.3, 0.6, Math.random())

      tempColor.setHSL(hue, saturation, lightness)
      mesh.current.setColorAt(i, tempColor)
    }

    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [count])

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial transparent opacity={0.6} />
    </instancedMesh>
  )
}

// Animated gradient sphere
function GradientSphere({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const mesh = useRef<THREE.Mesh>(null)

  // Transform mouse position to rotation
  const rotY = useTransform(mouseX, [-1, 1], [-0.2, 0.2])
  const rotX = useTransform(mouseY, [-1, 1], [0.2, -0.2])

  useFrame((state) => {
    if (!mesh.current) return

    // Smooth rotation based on mouse position
    mesh.current.rotation.y = MathUtils.lerp(
      mesh.current.rotation.y,
      state.clock.getElapsedTime() * 0.1 + rotY.get(),
      0.01,
    )
    mesh.current.rotation.x = MathUtils.lerp(mesh.current.rotation.x, rotX.get(), 0.01)
  })

  return (
    <mesh ref={mesh} scale={2.5} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="#a855f7" metalness={0.9} roughness={0.1} envMapIntensity={1} />
    </mesh>
  )
}

// Light beams that move with mouse
function LightBeams({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const group = useRef<THREE.Group>(null)

  // Transform mouse position to rotation
  const rotY = useTransform(mouseX, [-1, 1], [-0.3, 0.3])
  const rotX = useTransform(mouseY, [-1, 1], [0.3, -0.3])

  useFrame(() => {
    if (!group.current) return

    // Smooth rotation based on mouse position
    group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, rotY.get(), 0.02)
    group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, rotX.get(), 0.02)
  })

  return (
    <group ref={group}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0, 0, 0]} rotation={[0, Math.PI * 2 * (i / 5), 0]}>
          <planeGeometry args={[0.1, 10]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#ec4899" : "#a855f7"}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

// Scene component that contains all 3D elements
function Scene({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  return (
    <>
      <Environment preset="night" />
      <GradientSphere mouseX={mouseX} mouseY={mouseY} />
      <Particles count={300} mouseX={mouseX} mouseY={mouseY} />
      <LightBeams mouseX={mouseX} mouseY={mouseY} />

      {/* Ambient light for overall scene brightness */}
      <ambientLight intensity={0.2} />

      {/* Directional lights for highlights */}
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ec4899" />
      <directionalLight position={[-5, 5, 5]} intensity={0.5} color="#a855f7" />

      {/* Point lights for dramatic effect */}
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#ec4899" />
      <pointLight position={[0, -3, 0]} intensity={0.5} color="#a855f7" />
    </>
  )
}

export function HeroBackground3D() {
  // Track mouse position
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth mouse movement
  const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 25 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 100, damping: 25 })

  // Update mouse position
  const handleMouseMove = (event: React.MouseEvent) => {
    // Convert mouse position to normalized coordinates (-1 to 1)
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = (event.clientY / window.innerHeight) * 2 - 1

    mouseX.set(x)
    mouseY.set(y)
  }

  // Handle touch events for mobile
  const handleTouchMove = (event: React.TouchEvent) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0]
      const x = (touch.clientX / window.innerWidth) * 2 - 1
      const y = (touch.clientY / window.innerHeight) * 2 - 1

      mouseX.set(x)
      mouseY.set(y)
    }
  }

  return (
    <div className="absolute inset-0 z-0 size-full opacity-20" onMouseMove={handleMouseMove} onTouchMove={handleTouchMove}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <Scene mouseX={smoothMouseX} mouseY={smoothMouseY} />
      </Canvas>
    </div>
  )
}
