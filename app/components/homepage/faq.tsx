"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const FAQ_ITEMS = [
  {
    question: "What is USDT staking?",
    answer:
      "USDT staking is the process of locking up your USDT tokens in our platform to earn rewards. By staking your tokens, you contribute to the security and operations of the network while earning passive income in the form of additional USDT tokens.",
  },
  {
    question: "How are staking rewards calculated?",
    answer:
      "Staking rewards are calculated based on the amount of USDT you stake and the Annual Percentage Rate (APR) of your chosen plan. The rewards are calculated daily and can be claimed at any time through your dashboard.",
  },
  {
    question: "What are the minimum and maximum staking amounts?",
    answer:
      "The minimum staking amount is $100 USDT, and the maximum is $10,000 USDT per stake. These limits help ensure the platform remains accessible to small investors while maintaining stability for larger investments.",
  },
  {
    question: "How does the staking rewards system work?",
    answer:
      "When you stake USDT, you earn rewards every 24 hours. To receive them, you must log in and claim within each 24-hour window. Missed claims expire, but your staked funds keep earning in the next cycle.",
  },
  {
    question: "Which networks are supported for staking?",
    answer:
      "We currently support staking on four networks: Solana (SOL), Tron (TRX), BNB Smart Chain (BEP20), and TON. Each network offers the same APR rates and benefits.",
  },
  {
    question: "How does the referral program work?",
    answer:
      "Our referral program allows you to earn additional rewards by inviting others to Yieldra. For every user you directly refer, you'll receive a percentage of their staked amount. Plus, our system includes two additional downline levels. In total, you can earn up to 25% in referral bonuses—automatically and passively—as your network grows.",
  },
  {
    question: "Is my staked USDT safe?",
    answer:
      "Yes, we prioritize security above all else. Our platform is audited by CertiK, one of the leading blockchain security firms. We also implement industry-standard security practices and regular security assessments to protect your assets.",
  },
  {
    question: "When can I claim my rewards?",
    answer:
      "Rewards are calculated daily and can be claimed at any time through the 'Claim' button on your user dashboard. There are no minimum claim amounts or waiting periods.",
  },
  {
    question: "When and how can I withdraw my staking rewards, and are there any fees or penalties involved?",
    answer:
      `You can withdraw your staking rewards after a 30-day period directly from your profile. Once this period has passed, your rewards will be available in the "Withdrawable" section. Please note, a 5% fee applies to all withdrawals made after 30 days. Early withdrawals made before the 30-day period are subject to a 60% penalty.`,
  },
]

export function FAQ() {
  return (
    <section className="py-20 relative" id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="gradient-text">Frequently Asked Questions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Find answers to common questions about our staking platform.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <FaqItem key={index} question={item.question} answer={item.answer} index={index} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400">
            Still have questions?{" "}
            <a
              href="https://t.me/Y_Support1"
              target="_blank"
              className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-medium"
            >
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="border border-white/10 rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 text-left bg-gray-900/50 hover:bg-gray-900/80 transition-colors duration-200"
      >
        <h3 className="text-lg font-medium">{question}</h3>
        <ChevronDown
          className={cn("h-5 w-5 text-gray-400 transition-transform duration-200", isOpen ? "rotate-180" : "")}
        />
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-800/30">
          <p className="text-gray-300">{answer}</p>
        </div>
      )}
    </motion.div>
  )
}
