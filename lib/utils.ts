import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as cheerio from "cheerio";
import { compileVerifyEmailTemplate } from "./mail";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function htmlToPlainText(html: string) {
  const $ = cheerio.load(html);

  // Replace img tags with their alt text or a placeholder
  $("img").each(function () {
    const altText = $(this).attr("alt") || "";
    $(this).replaceWith(altText);
  });

  // Handle other specific tags if needed
  $("br").replaceWith("\n");
  $("p, h1, h2, h3, h4, h5, h6").append("\n");

  // Extract and clean the text
  let text = $("body").text();
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

export function calculateDailyReward(principal: number, apr: number): number {
  const dailyRate = Math.pow(1 + apr / 100, 1 / 365) - 1;
  return principal * dailyRate;
}

export function getTimeRemainingToClaim(deadline: Date): {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  console.log("🚀 ~ getTimeRemainingToClaim:", hours, minutes, seconds)

  return { hours, minutes, seconds, isExpired: false };
}
