"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import {
  ChevronUp,
  FileText,
  Calendar,
  User,
  Briefcase,
  Users,
  DollarSign,
  ArrowDownUp,
  Percent,
  AlertTriangle,
  Shield,
  XCircle,
  Lock,
  FileEdit,
  Scale,
  Mail,
} from "lucide-react"

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide back to top button
      if (window.scrollY > 500) {
        setShowBackToTop(true)
      } else {
        setShowBackToTop(false)
      }

      // Update active section
      const sections = document.querySelectorAll("section[id]")
      let currentSection: string | null = null

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top
        if (sectionTop < 100) {
          currentSection = section.id
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      const yOffset = -100 // Adjust based on your header height
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // List of sections for the table of contents
  const sections = [
    { id: "introduction", title: "Introduction", icon: <FileText className="h-4 w-4" /> },
    { id: "eligibility", title: "Eligibility", icon: <User className="h-4 w-4" /> },
    { id: "account-registration", title: "Account Registration", icon: <User className="h-4 w-4" /> },
    { id: "investment-plans", title: "Investment Plans", icon: <Briefcase className="h-4 w-4" /> },
    { id: "referral-program", title: "Referral Program", icon: <Users className="h-4 w-4" /> },
    { id: "returns-payouts", title: "Returns & Payouts", icon: <DollarSign className="h-4 w-4" /> },
    { id: "deposits-withdrawals", title: "Deposits & Withdrawals", icon: <ArrowDownUp className="h-4 w-4" /> },
    { id: "fees-charges", title: "Fees & Charges", icon: <Percent className="h-4 w-4" /> },
    { id: "risks-disclaimer", title: "Risks & Disclaimer", icon: <AlertTriangle className="h-4 w-4" /> },
    { id: "user-responsibilities", title: "User Responsibilities", icon: <Shield className="h-4 w-4" /> },
    { id: "account-termination", title: "Account Termination", icon: <XCircle className="h-4 w-4" /> },
    { id: "privacy-policy", title: "Privacy Policy", icon: <Lock className="h-4 w-4" /> },
    { id: "amendments", title: "Amendments", icon: <FileEdit className="h-4 w-4" /> },
    { id: "governing-law", title: "Governing Law", icon: <Scale className="h-4 w-4" /> },
    { id: "contact-information", title: "Contact Information", icon: <Mail className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text">Terms and Conditions</span>
              </h1>
              <div className="flex items-center justify-center gap-2 text-gray-400 mb-8">
                <Calendar className="h-5 w-5" />
                <span>Last Updated: 20/05/2025</span>
              </div>
              <p className="text-lg text-gray-300">
                Welcome to Yieldra! By accessing or using our platform "Yieldra", you agree to be bound by these Terms
                and Conditions ("Terms"). Please read them carefully before investing.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Background elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl"></div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Sticky on desktop */}
          <div className="lg:w-1/4">
            <div className="lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 glass-effect p-6">
                  <h2 className="text-xl font-bold mb-4 gradient-text">Table of Contents</h2>
                  <ul className="space-y-2">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <button
                          onClick={() => scrollToSection(section.id)}
                          className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            activeSection === section.id
                              ? "bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-white"
                              : "hover:bg-gray-800/50 text-gray-400 hover:text-white"
                          }`}
                        >
                          {section.icon}
                          <span>{section.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Terms Content */}
          <div className="lg:w-3/4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 glass-effect p-6 md:p-8">
                {/* 1. Introduction */}
                <section id="introduction" className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">1. Introduction</h2>
                  </div>
                  <div className="pl-14">
                    <p className="text-gray-300">
                      These Terms govern your use of Yieldra and any services related to investing and managing funds
                      through our platform.
                    </p>
                  </div>
                  <div className="mt-8 border-b border-gray-800"></div>
                </section>

                {/* 2. Eligibility */}
                <section id="eligibility" className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">2. Eligibility</h2>
                  </div>
                  <div className="pl-14">
                    <p className="text-gray-300 mb-4">To use our services, you must:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>Be at least 18 years old.</li>
                      <li>Have the legal capacity to enter into a binding agreement.</li>
                      <li>Not be restricted by applicable laws from using investment services.</li>
                    </ul>
                  </div>
                  <div className="mt-8 border-b border-gray-800"></div>
                </section>

                {/* 3. Account Registration */}
                <section id="account-registration" className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">3. Account Registration</h2>
                  </div>
                  <div className="pl-14">
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>You must register and create an account with accurate, complete information.</li>
                      <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                      <li>You agree to notify us immediately of any unauthorized use of your account.</li>
                    </ul>
                  </div>
                  <div className="mt-8 border-b border-gray-800"></div>
                </section>

                {/* 4. Investment Plans */}
                <section id="investment-plans" className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">4. Investment Plans</h2>
                  </div>
                  <div className="pl-14">
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>
                        Users can choose from various investment plans with different return rates and fixed durations.
                      </li>
                      <li>
                        Each plan includes:
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Minimum and maximum deposit amounts.</li>
                          <li>Fixed percentage return.</li>
                          <li>Investment term (days/weeks/months).</li>
                        </ul>
                      </li>
                    </ul>

                    <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                      <p className="font-medium mb-2">Example:</p>
                      <ul className="list-disc pl-6 space-y-2 text-gray-300">
                        <li>Plan A: Invest $100 – $999 for 10 days, earn 5% profit.</li>
                        <li>Plan B: Invest $1,000 – $4,999 for 20 days, earn 10% profit.</li>
                      </ul>
                    </div>

                    <p className="mt-4 text-gray-300">Details of all plans are clearly stated on the Platform.</p>
                  </div>
                  <div className="mt-8 border-b border-gray-800"></div>
                </section>

                {/* 5. Referral Program */}
                <section id="referral-program" className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">5. Referral Program</h2>
                  </div>
                  <div className="pl-14">
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>Our referral program rewards users who invite others to invest on the platform.</li>
                      <li>
                        When a referred user registers using your referral link and makes an investment, you receive a
                        bonus percentage based on their investment amount.
                      </li>
                    </ul>

                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                      <p className="font-medium mb-2">Example:</p>
                      <p className="text-gray-300">
                        If your referral invests $1,000 and the referral bonus is 5%, you earn $50.
                      </p>
                    </div>

                    <ul className="mt-4 list-disc pl-6 space-y-2 text-gray-300">
                      <li>
                        Referral bonuses are credited to your wallet automatically or according to our payout schedule.
                      </li>
                      <li>
                        Referral abuse, including fake accounts or circular referrals, will result in disqualification
                        and possible account suspension.
                      </li>
                      <li>We reserve the right to modify referral bonus percentages and conditions at any time.</li>
                    </ul>
                  </div>
                  <div className="mt-8 border-b border-gray-800"></div>
                </section>

                {/* 6. Returns & Payouts */}
                <section id="returns-payouts" className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">6. Returns & Payouts</h2>
                  </div>
                  <div className="pl-14">
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>Profits are paid out after the investment term ends.</li>
                      <li>Returns are calculated based on the initial investment and selected plan.</li>
                      <li>Payouts will be made to the account or wallet specified by the user during registration.</li>
                    </ul>
                  </div>
                  <div className="mt-8 border-b border-gray-800"></div>
                </section>

                {/* 7. Deposits & Withdrawals */}
                <section id="deposits-withdrawals" className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                      <ArrowDownUp className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">7. Deposits & Withdrawals</h2>
                  </div>
                  <div className="pl-14">
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>Users can fund their accounts using supported payment methods.</li>
                      <li>
                        Withdrawals are processed within [e.g. 24–72 hours], subject to verification and compliance
                        checks.
                      </li>
                      <li>
                        We reserve the right to delay or withhold withdrawals if fraud or suspicious activity is
                        suspected.
                      </li>
                    </ul>
                  </div>
                  <div className="mt-8 border-b border-gray-800"></div>
                </section>

                {/* 8. Fees & Charges */}
                <section id="fees-charges" className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                      <Percent className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">8. Fees & Charges</h2>
                  </div>
                  <div className="pl-14">
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>We may charge transaction or service fees as stated on the platform.</li>
                      <li>All fees are subject to change with prior notice.</li>
                    </ul>
                  </div>
                  <div className="mt-8 border-b border-gray-800"></div>
                </section>

                {/* 9. Risks & Disclaimer */}
                <section id="risks-disclaimer" className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">9. Risks & Disclaimer</h2>
                  </div>
                  <div className="pl-14">
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>
                        All investments carry risk. While we aim to provide stable returns, we do not guarantee profits.
                      </li>
                      <li>
                        You agree to invest at your own risk and acknowledge that past performance is not indicative of
                        future results.
                      </li>
                      <li>
                        We are not liable for losses resulting from market fluctuations, force majeure events, or
                        third-party failures.
                      </li>
                    </ul>
                  </div>
                  <div className="mt-8 border-b border-gray-800"></div>
                </section>

                {/* 10. User Responsibilities */}
                <section id="user-responsibilities" className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">10. User Responsibilities</h2>
                  </div>
                  <div className="pl-14">
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>You agree not to use the platform for illegal or unauthorized purposes.</li>
                      <li>You must provide accurate and up-to-date personal and financial information.</li>
                      <li>
                        Any attempts to abuse the platform or exploit technical vulnerabilities will lead to account
                        suspension or legal action.
                      </li>
                    </ul>
                  </div>
                  <div className="mt-8 border-b border-gray-800"></div>
                </section>

                {/* 11. Account Termination */}
                <section id="account-termination" className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                      <XCircle className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">11. Account Termination</h2>
                  </div>
                  <div className="pl-14">
                    <p className="text-gray-300 mb-4">We reserve the right to terminate or suspend your account if:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>You breach any part of these Terms.</li>
                      <li>Fraud or suspicious activity is detected.</li>
                      <li>You violate applicable laws.</li>
                    </ul>
                  </div>
                  <div className="mt-8 border-b border-gray-800"></div>
                </section>

                {/* 12. Privacy Policy */}
                <section id="privacy-policy" className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">12. Privacy Policy</h2>
                  </div>
                  <div className="pl-14">
                    <p className="text-gray-300">
                      Your personal information is handled in accordance with our Privacy Policy, which outlines how we
                      collect, use, and protect your data.
                    </p>
                  </div>
                  <div className="mt-8 border-b border-gray-800"></div>
                </section>

                {/* 13. Amendments */}
                <section id="amendments" className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                      <FileEdit className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">13. Amendments</h2>
                  </div>
                  <div className="pl-14">
                    <p className="text-gray-300">
                      We reserve the right to modify these Terms at any time. Updates will be posted on the platform and
                      communicated to users. Continued use of the platform means you accept the revised Terms.
                    </p>
                  </div>
                  <div className="mt-8 border-b border-gray-800"></div>
                </section>

                {/* 14. Governing Law */}
                <section id="governing-law" className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                      <Scale className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">14. Governing Law</h2>
                  </div>
                  <div className="pl-14">
                    <p className="text-gray-300">
                      These Terms are governed by the laws of Norway. Any disputes will be resolved in accordance with
                      those laws.
                    </p>
                  </div>
                  <div className="mt-8 border-b border-gray-800"></div>
                </section>

                {/* 15. Contact Information */}
                <section id="contact-information" className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">15. Contact Information</h2>
                  </div>
                  <div className="pl-14">
                    <p className="text-gray-300 mb-4">
                      If you have any questions or concerns regarding these Terms, you can contact us at:
                    </p>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="h-5 w-5 text-purple-400" />
                      <span>
                        Email:{" "}
                        <a
                          href="mailto:yieldraa@gmail.com"
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          yieldraa@gmail.com
                        </a>
                      </span>
                    </div>
                  </div>
                </section>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="rounded-full w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 shadow-lg"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}
