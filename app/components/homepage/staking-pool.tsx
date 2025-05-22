"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"

export function StakingPool() {
  const [isVisible, setIsVisible] = useState(false)
  const [now, setNow] = useState(Date.now())
  const controls = useAnimation()
  const ref = useRef<HTMLDivElement>(null)

  // Date setup (May 22, 2025 to May 22, 2026 UTC)
  const startDate = new Date(Date.UTC(2025, 4, 22))
  const endDate = new Date(Date.UTC(2025, 11, 22))
  const totalDuration = endDate.getTime() - startDate.getTime()

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate current USDT and fill percentage
  const elapsed = now - startDate.getTime()
  let currentUSDT = 0
  if (elapsed <= 0) {
    currentUSDT = 0
  } else if (elapsed >= totalDuration) {
    currentUSDT = 100000
  } else {
    currentUSDT = (elapsed / totalDuration) * 100000
  }
  const poolFill = (currentUSDT / 100000) * 100

  // Visibility animation
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

    if (ref.current) observer.observe(ref.current)
    return () => {
      if (ref.current) observer.unobserve(ref.current)
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
          {/* <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
            }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Progress towards our 50,000 USDT goal by May 22, 2026
          </motion.p> */}
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
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-600 to-pink-500 transition-all duration-1000 ease-in-out"
                  style={{ height: `${poolFill + (1000/100)}%` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-purple-400 to-pink-400 opacity-50">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-white/20"></div>
                  </div>

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

                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                  <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                      ${Math.floor(1000 + currentUSDT).toLocaleString()} USDT
                    </span>
                  </div>
                </div>

                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-12 bg-gradient-to-b from-gray-400 to-gray-600 rounded-b-lg"></div>
                  <div className="w-4 h-2 bg-gray-300 mx-auto rounded-b-lg relative">
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
              </div>

              {/* <div className="mt-6 text-center text-sm text-gray-400">
                The pool increases linearly until reaching 50,000 USDT on May 22, 2026
              </div> */}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

// Bubble component remains the same
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