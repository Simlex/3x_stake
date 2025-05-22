"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { CheckCircle2, Globe, Shield, Zap, Users, Clock } from "lucide-react"
import Link from "next/link"
import { StakingPlans } from "../components/homepage/staking-plans"

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">About Us</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                At Yieldra, we're redefining what it means to earn in the crypto economy.
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-gray-400 mb-10"
            >
              We exist to empower everyday people with the tools to build real financial freedom, not years from now, but
              starting today. Yieldra is a high-yield staking platform where users can earn up to 10% return on their
              staked amount, with daily claimable rewards that put your money to work 24/7.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white px-8 py-6 text-lg rounded-full transition-opacity duration-200"
                asChild
              >
                <Link href="/#stake">Start Staking</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500/50 hover:border-purple-500 text-white px-8 py-6 text-lg rounded-full"
                asChild
              >
                <Link href="#tiers">View Tiers</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Background elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl"></div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Transparent. Secure. Powerful.</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Backed by blockchain and built for trust, Yieldra is fully audited and certified by CertiK, one of the
              most respected security firms in the Web3 world. Our smart contracts are publicly verifiable and
              rigorously tested to ensure complete transparency and user protection.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CoreValueCard
              icon={<Shield className="h-10 w-10 text-purple-400" />}
              title="Transparent"
              description="Our operations, smart contracts, and financial models are fully transparent and verifiable on the blockchain."
              delay={0}
            />
            <CoreValueCard
              icon={<Shield className="h-10 w-10 text-pink-400" />}
              title="Secure"
              description="CertiK-audited smart contracts and industry-leading security measures protect your assets at all times."
              delay={0.2}
            />
            <CoreValueCard
              icon={<Zap className="h-10 w-10 text-amber-400" />}
              title="Powerful"
              description="Our platform is designed to maximize your earning potential with up to 10% daily ROI and compound growth."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* <StakingPlans /> */}

      {/* Staking Tiers Section */}
      <section id="tiers" className="py-20 relative bg-gray-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Tiered Staking Model</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              We've designed a tiered staking model that rewards commitment and scales with your investment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StakingTierCard
              name="Bronze"
              range="$100 – $500"
              color="from-amber-500 to-amber-700"
              bgColor="bg-amber-950/20"
              borderColor="border-amber-500/20"
              delay={0}
            />
            <StakingTierCard
              name="Silver"
              range="$500 – $2,000"
              color="from-gray-300 to-gray-500"
              bgColor="bg-gray-800/40"
              borderColor="border-gray-400/20"
              popular={true}
              delay={0.1}
            />
            <StakingTierCard
              name="Gold"
              range="$2,000 – $5,000"
              color="from-yellow-400 to-yellow-600"
              bgColor="bg-yellow-900/20"
              borderColor="border-yellow-500/20"
              delay={0.2}
            />
            <StakingTierCard
              name="Platinum"
              range="$5,000 – $10,000"
              color="from-purple-400 to-purple-600"
              bgColor="bg-purple-900/20"
              borderColor="border-purple-500/20"
              delay={0.3}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <p className="text-gray-400">
              Each tier offers attractive returns, with up to 10% daily ROI, depending on staking duration and referral
              engagement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Referral Program Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="gradient-text">Earn More. Invite More.</span>
              </h2>
              <p className="text-lg text-gray-400 mb-6">
                With Yieldra, sharing the opportunity is part of the reward. Our Referral Program offers up to 25% in
                bonuses for every successful invite. Whether you're growing your passive income or building a staking
                network, Yieldra gives you the power to multiply your earning potential effortlessly.
              </p>
              {/* <Button
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-opacity duration-200"
                asChild
              >
                <Link href="/referrals">Learn About Referrals</Link>
              </Button> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-2xl blur-xl"></div>
                <Card className="border-0 glass-effect relative">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 mb-6">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Referral Bonuses</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Earn up to 25% of the staking rewards from your direct referrals</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Earn up to 15% from your second-level referrals (your referrals' referrals)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Earn up to 7.5% from your third-level referrals (your referrals' referrals)</span>
                      </li>
                      {/* <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Earn up to a maximum of 25% of referral bonus</span>
                      </li> */}
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Unlimited earning potential with no cap on referrals</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 relative bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2 order-2 lg:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10"></div>
                <img
                  src="/bergen.jpg"
                  alt="Bergen, Norway"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/20 mb-2">Bergen, Norway</Badge>
                  <h3 className="text-2xl font-bold mb-2">Our Headquarters</h3>
                  <p className="text-gray-300">
                    A global city known for its forward-thinking approach to finance, sustainability, and technology.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2 order-1 lg:order-2"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="gradient-text">Built in Norway. Designed for the World.</span>
              </h2>
              <p className="text-lg text-gray-400 mb-6">
                Yieldra is proudly headquartered in Bergen, Norway, a global city known for its forward-thinking approach
                to finance, sustainability, and technology. Our team of blockchain engineers, financial strategists, and
                community builders is committed to making decentralized finance truly accessible, secure, and rewarding
                for all.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold">Global Platform</h4>
                  <p className="text-gray-400">Serving users in over 150 countries</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Why Choose Yieldra?</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Whether you're just starting your crypto journey or looking for your next big opportunity, Yieldra is your
              partner in profit.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-purple-400" />}
              title="Up to 10% Daily ROI"
              description="Maximize your earnings with our industry-leading return rates."
              delay={0}
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-purple-400" />}
              title="Certified by CertiK"
              description="Our platform is fully audited by one of the most respected security firms in Web3."
              delay={0.1}
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6 text-purple-400" />}
              title="Daily Claimable Rewards"
              description="Access your earnings daily without lock-up periods or withdrawal restrictions."
              delay={0.2}
            />
            <FeatureCard
              icon={<CheckCircle2 className="h-6 w-6 text-purple-400" />}
              title="Transparent Smart Contracts"
              description="All our contracts are publicly verifiable and rigorously tested."
              delay={0.3}
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-purple-400" />}
              title="Up to 25% Referral Bonus"
              description="Earn substantial bonuses by inviting others to join the platform."
              delay={0.4}
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6 text-purple-400" />}
              title="Global Platform with Norwegian Roots"
              description="Combining Nordic reliability with worldwide accessibility."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="gradient-text">Stake with purpose. Grow with confidence.</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">Welcome to Yieldra.</p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white px-8 py-6 text-lg rounded-full transition-opacity duration-200"
              asChild
            >
              <Link href="/#stake">Start Staking Now</Link>
            </Button>
          </motion.div>
        </div>

        {/* Background elements */}
        <div className="absolute top-1/3 left-10 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-10 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl"></div>
      </section>

    </div>
  )
}

// Component for core values
function CoreValueCard({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card className="border-0 glass-effect h-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-gray-400">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Component for staking tiers
function StakingTierCard({
  name,
  range,
  color,
  bgColor,
  borderColor,
  popular = false,
  delay = 0,
}: {
  name: string
  range: string
  color: string
  bgColor: string
  borderColor: string
  popular?: boolean
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card className={`border ${borderColor} ${bgColor} overflow-hidden relative h-full flex flex-col`}>
        {popular && (
          <div className="absolute top-0 right-0">
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 rounded-tl-none rounded-br-none rounded-tr-none px-3 py-1.5">
              Popular
            </Badge>
          </div>
        )}
        <CardContent className="p-6 flex flex-col items-center text-center">
          <h3 className={`text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r ${color}`}>{name}</h3>
          <p className="text-gray-400 mb-4">Investment Range</p>
          <p className="text-xl font-bold mb-4">{range}</p>
          <Button
            variant="outline"
            className={`mt-auto border-0 bg-gradient-to-r ${color} bg-opacity-10 hover:bg-opacity-20 transition-all duration-200`}
            asChild
          >
            <Link href="/#stake">View Details</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Component for features
function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card className="border-0 glass-effect h-full">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20 flex-shrink-0">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <p className="text-gray-400">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
