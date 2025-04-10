"use client"

import React from 'react'
import { Navbar } from './components/navbar'
import { Hero } from './components/hero'
import { Stats } from './components/stats'
import { StakingPlans } from './components/staking-plans'
import { StakingPool } from './components/staking-pool'
import { RecentRewards } from './components/recent-rewards'
import { NewsCarousel } from './components/news-carousel'
import { FAQ } from './components/faq'
import { Footer } from './components/footer'

type Props = {}

export default function HomePage({}: Props) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black dark:from-black dark:via-purple-950/20 dark:to-black">
      <Navbar />
      <Hero />
      <Stats />
      <StakingPlans />
      <StakingPool />
      <RecentRewards />
      <NewsCarousel />
      <FAQ />
      <Footer />
    </main>
  )
}