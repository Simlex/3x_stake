"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"

export function StakingPool() {
  const [poolFill, setPoolFill] = useState(65)
  const [isVisible, setIsVisible] = useState(false)
  const controls = useAnimation()
  const ref = useRef<HTMLDivElement>(null)

  // Simulate pool filling up over time
  useEffect(() => {
    const interval = setInterval(() => {
      setPoolFill((prev) => {
        const newValue = prev + Math.random() * 0.5
        return newValue > 100 ? 65 : newValue
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Animation when component comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          controls.start("visible")
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [controls])

  return (
    <section className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
            }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="gradient-text">Staking Pool</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
            }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Watch our staking pool grow in real-time as new deposits are added.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.4 } },
          }}
          className="max-w-3xl mx-auto"
        >
          <Card className="border-0 glass-effect overflow-hidden">
            <CardHeader>
              <CardTitle className="text-center">USDT Staking Pool</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative h-64 bg-gradient-to-b from-gray-900 to-gray-950 rounded-lg border border-white/10 overflow-hidden">
                {/* Water fill animation */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-600 to-pink-500 transition-all duration-1000 ease-in-out"
                  style={{ height: `${poolFill}%` }}
                >
                  {/* Animated water surface */}
                  <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-purple-400 to-pink-400 opacity-50">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-white/20"></div>
                  </div>

                  {/* Bubbles */}
                  {isVisible && (
                    <>
                      <Bubble size={8} left={15} delay={0} duration={4} />
                      <Bubble size={12} left={30} delay={1.5} duration={5} />
                      <Bubble size={6} left={50} delay={0.8} duration={3.5} />
                      <Bubble size={10} left={70} delay={2.2} duration={4.5} />
                      <Bubble size={7} left={85} delay={1.2} duration={3.8} />
                    </>
                  )}
                </div>

                {/* Pool stats */}
                <div className="absolute top-4 left-0 right-0 flex justify-center">
                  <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                      ${Math.floor(20000 + (poolFill - 65) * 1000).toLocaleString()} USDT
                    </span>
                  </div>
                </div>

                {/* Tap/faucet */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-12 bg-gradient-to-b from-gray-400 to-gray-600 rounded-b-lg"></div>
                  <div className="w-4 h-2 bg-gray-300 mx-auto rounded-b-lg relative">
                    {/* Dripping animation */}
                    {isVisible && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                        <motion.div
                          initial={{ y: 0, opacity: 1, scale: 1 }}
                          animate={{ y: 100, opacity: 0, scale: 0 }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                            ease: "easeIn",
                          }}
                          className="w-2 h-2 bg-blue-400 rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Percentage indicator */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {Math.floor(poolFill)}% Full
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-400">
                New deposits are automatically added to the staking pool and start earning rewards immediately.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

function Bubble({
  size,
  left,
  delay,
  duration,
}: {
  size: number
  left: number
  delay: number
  duration: number
}) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0.7 }}
      animate={{ y: -100, opacity: 0 }}
      transition={{
        delay,
        duration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeOut",
      }}
      className="absolute rounded-full bg-white/30"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        bottom: "10%",
      }}
    />
  )
}
