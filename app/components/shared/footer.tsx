import type React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/30 backdrop-blur-md">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-sm"></div>
                <div className="absolute inset-0.5 bg-black rounded-full flex items-center justify-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold">
                    Y
                  </span>
                </div>
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                Yieldra
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              The most secure and flexible staking platform for USDT, offering
              competitive APR rates and instant rewards.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Twitter className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Github className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Linkedin className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-2">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/about-us">About Us</FooterLink>
              <FooterLink href="/#plans">Stake</FooterLink>
              {/* <FooterLink href="/rewards">Rewards</FooterLink> */}
              <FooterLink href="/referrals">Referrals</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink href="/#faq">FAQ</FooterLink>
              {/* <FooterLink href="/docs">Documentation</FooterLink>
              <FooterLink href="/security">Security</FooterLink>
              <FooterLink href="/audit">Audit Reports</FooterLink> */}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Community</h3>
            <ul className="space-y-2">
              <FooterLink href="https://t.me/Yieldraa" target="_blank">Telegram</FooterLink>
              <FooterLink href="https://x.com/Yieldra" target="_blank">Twitter</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-0 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 USDT Yield. All rights reserved.
          </p>

          <div className="flex items-center mt-4 md:mt-0">
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <Link
                href={"/complianace"}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                    Terms & Conditions
                </Link>
            </div>
          </div>

          <div className="flex items-center mt-4 md:mt-0">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                All Systems Operational
              </span>
              <span className="mx-2">|</span>
              <span>Audited by CertiK</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  target,
}: {
  href: string;
  children: React.ReactNode;
  target?: string
}) {
  return (
    <li>
      <Link
        href={href}
        target={target}
        className="text-gray-400 hover:text-white transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
    >
      <span className="text-gray-400 hover:text-white transition-colors duration-200">
        {icon}
      </span>
    </Link>
  );
}
