"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Article, ArticleItem } from "@/app/model/IArticle";
import Link from "next/link";

// Sample news data
const NEWS_ITEMS = [
  {
    id: 1,
    title: "USDT Staking Platform Reaches $10M TVL",
    content:
      "Our platform has reached a significant milestone with $10M in Total Value Locked, demonstrating strong user confidence.",
    date: "April 5, 2025",
    category: "Platform News",
  },
  {
    id: 2,
    title: "New Platinum Tier Launched with 5% APR",
    content:
      "We're excited to announce our new Platinum tier offering an impressive 5% APR for serious investors.",
    date: "April 3, 2025",
    category: "Product Update",
  },
  {
    id: 3,
    title: "Bitcoin Surpasses $100,000 for the First Time",
    content:
      "Bitcoin has reached a new all-time high, breaking the $100,000 barrier for the first time in history.",
    date: "April 1, 2025",
    category: "Market News",
  },
  {
    id: 4,
    title: "Enhanced Security Features Implemented",
    content:
      "We've added new security features including 2FA and advanced encryption to better protect your assets.",
    date: "March 28, 2025",
    category: "Security",
  },
  {
    id: 5,
    title: "Referral Program Rewards Doubled This Month",
    content:
      "For the month of April, we're doubling all referral rewards. Invite your friends and earn even more!",
    date: "March 25, 2025",
    category: "Promotion",
  },
];

export function NewsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [articles, setArticles] = useState<ArticleItem[]>();

  async function getArticles() {
    const response = await fetch(
      `https://data-api.coindesk.com/news/v1/article/list?lang=EN&limit=5&api_key=${process.env.NEXT_PUBLIC_COINDESK_API_KEY}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );
    const data: Article = await response.json();
    setArticles(data?.Data ?? undefined);
  }

  useEffect(() => {
    getArticles();
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % NEWS_ITEMS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  const handlePrev = () => {
    setAutoplay(false);
    setActiveIndex((current) =>
      current === 0 ? NEWS_ITEMS.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current + 1) % NEWS_ITEMS.length);
  };

  function truncateWords(text: string, maxWords: number): string {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return text;
  }

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="gradient-text">Latest Crypto News</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Stay updated with the latest news and developments in the crypto
            world.
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden h-fit max-h-[280px]">
            <div
              className="flex transition-transform duration-500 ease-in-out will-change-transform"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {articles?.map((item) => (
                <div key={item.ID} className="w-full h-fit flex-shrink-0 px-4">
                  <Card className="border-0 glass-effect h-fit">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge
                          variant="outline"
                          className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20"
                        >
                          {item.CATEGORY_DATA[0].NAME}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          {item.PUBLISHED_ON}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3">{item.TITLE}</h3>
                      <p className="text-gray-300 mb-2">
                        {truncateWords(item.BODY, 50)}
                      </p>
                      <Link
                        href={item.URL}
                        target="_blank"
                        className="text-gray-400 underline"
                      >
                        Read more
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 backdrop-blur-sm z-10"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full border border-white/10 bg-black/50 backdrop-blur-sm z-10"
            onClick={handleNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {NEWS_ITEMS.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-purple-500 w-6"
                    : "bg-gray-600 w-2"
                }`}
                onClick={() => {
                  setAutoplay(false);
                  setActiveIndex(index);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
