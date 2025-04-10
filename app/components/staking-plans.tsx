"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, ChevronRight } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { StakeModal } from "@/app/components/stake-modal"

const STAKING_PLANS = [
  {
    name: "Bronze",
    tier: "Beginner",
    minAmount: 100,
    maxAmount: 500,
    apr: 3,
    features: ["Instant rewards calculation", "Withdraw anytime", "Basic support"],
    popular: false,
    color: "from-amber-500 to-amber-700",
    bgColor: "bg-amber-950/20",
    borderColor: "border-amber-500/20",
  },
  {
    name: "Silver",
    tier: "Intermediate",
    minAmount: 500,
    maxAmount: 2000,
    apr: 3.5,
    features: ["Instant rewards calculation", "Withdraw anytime", "Priority support", "Referral bonuses"],
    popular: true,
    color: "from-gray-300 to-gray-500",
    bgColor: "bg-gray-800/40",
    borderColor: "border-gray-400/20",
  },
  {
    name: "Gold",
    tier: "Advanced",
    minAmount: 2000,
    maxAmount: 5000,
    apr: 4,
    features: [
      "Instant rewards calculation",
      "Withdraw anytime",
      "VIP support",
      "Enhanced referral bonuses",
      "Early access to new features",
    ],
    popular: false,
    color: "from-yellow-400 to-yellow-600",
    bgColor: "bg-yellow-900/20",
    borderColor: "border-yellow-500/20",
  },
  {
    name: "Platinum",
    tier: "Elite",
    minAmount: 5000,
    maxAmount: 10000,
    apr: 5,
    features: [
      "Instant rewards calculation",
      "Withdraw anytime",
      "Dedicated account manager",
      "Maximum referral bonuses",
      "Early access to new features",
      "Exclusive investment opportunities",
    ],
    popular: false,
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-900/20",
    borderColor: "border-purple-500/20",
  },
]

export function StakingPlans() {
  const [selectedPlan, setSelectedPlan] = useState<(typeof STAKING_PLANS)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSelectPlan = (plan: (typeof STAKING_PLANS)[0]) => {
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  return (
    <section className="py-20 relative" id="plans">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="gradient-text">Flexible Staking Plans</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Choose the plan that fits your investment strategy and start earning rewards today.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAKING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className={`border ${plan.borderColor} ${plan.bgColor} overflow-hidden relative h-full flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 rounded-tl-none rounded-br-none rounded-tr-none px-3 py-1.5">
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${plan.color}`}>{plan.name}</span>
                  </CardTitle>
                  <CardDescription>{plan.tier} Tier</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <p className="text-sm text-gray-400">Investment Range</p>
                    <p className="text-2xl font-bold">
                      ${plan.minAmount} - ${plan.maxAmount}
                    </p>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm text-gray-400">Annual Percentage Rate</p>
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                      {plan.apr}%
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white transition-opacity duration-200`}
                  >
                    Select Plan <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/20">
            <span className="text-sm text-gray-300">All plans are audited by</span>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              CertiK
            </span>
          </div>
        </div>
      </div>

      {selectedPlan && <StakeModal plan={selectedPlan} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </section>
  )
}
