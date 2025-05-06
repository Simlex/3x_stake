"use client"

import React from 'react'
import { Hero } from './components/homepage/hero'
import { Stats } from './components/homepage/stats'
import { StakingPlans } from './components/homepage/staking-plans'
import { StakingPool } from './components/homepage/staking-pool'
import { RecentRewards } from './components/homepage/recent-rewards'
import { NewsCarousel } from './components/homepage/news-carousel'
import { FAQ } from './components/homepage/faq'

type Props = {}

export default function HomePage({}: Props) {
  return (
    <div className="">
      <Hero />
      <Stats />
      <StakingPlans />
      <StakingPool />
      <RecentRewards />
      <NewsCarousel />
      <FAQ />
    </div>
  )
}