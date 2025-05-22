// app/api/coindesk-articles/route.ts
import { NextResponse } from "next/server";

export const revalidate = 86400; // 24 hours in seconds

export async function GET() {
  const apiKey = process.env.COINDESK_API_KEY!;
  const apiUrl = new URL(
    `https://data-api.coindesk.com/news/v1/article/list`
  );
  apiUrl.searchParams.append("lang", "EN");
  apiUrl.searchParams.append("limit", "10");
  apiUrl.searchParams.append("api_key", `${apiKey}`);

  try {
    const response = await fetch(`https://data-api.coindesk.com/news/v1/article/list?lang=EN&limit=10&api_key=${process.env.NEXT_PUBLIC_COINDESK_API_KEY}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`CoinDesk API responded with ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching CoinDesk articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
