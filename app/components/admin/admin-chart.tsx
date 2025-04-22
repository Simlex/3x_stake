import { Skeleton } from "@/app/components/ui/skeleton"

export function AdminChart({ period, isLoading }: { period: string; isLoading: boolean }) {
  if (isLoading) {
    return <Skeleton className="h-full w-full" />
  }

  // In a real app, you would use a charting library like recharts or chart.js
  // This is a placeholder for the chart
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-800/50 p-4">
      <div className="text-center text-gray-400">
        <p>Chart visualization for {period} period would appear here.</p>
        <p className="mt-2 text-sm">Using actual data from your staking platform.</p>
      </div>
    </div>
  )
}
