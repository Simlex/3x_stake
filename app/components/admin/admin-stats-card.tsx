import type React from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Skeleton } from "@/app/components/ui/skeleton"
import { ArrowDown, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminStatsCardProps {
  title: string
  value: string
  icon: React.ReactNode
  trend: number
  isLoading: boolean
  description: string
  color: string
}

export function AdminStatsCard({ title, value, icon, trend, isLoading, description, color }: AdminStatsCardProps) {
  return (
    <Card className="border-0 glass-effect">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-400">{title}</p>
            {isLoading ? <Skeleton className="h-8 w-24" /> : <p className="text-2xl font-bold">{value}</p>}
          </div>
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br", color)}>
            {icon}
          </div>
        </div>
        {/* <div className="mt-4 flex items-center text-sm">
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <>
              <div
                className={cn(
                  "mr-2 flex items-center",
                  trend > 0 ? "text-green-400" : trend < 0 ? "text-red-400" : "text-gray-400",
                )}
              >
                {trend > 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : trend < 0 ? (
                  <ArrowDown className="mr-1 h-3 w-3" />
                ) : null}
                <span>{Math.abs(trend)}%</span>
              </div>
              <span className="text-gray-400">{description}</span>
            </>
          )}
        </div> */}
      </CardContent>
    </Card>
  )
}
