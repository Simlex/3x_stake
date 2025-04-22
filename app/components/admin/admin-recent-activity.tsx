import { Skeleton } from "@/app/components/ui/skeleton"
import { Coins, User, CreditCard, AlertTriangle } from "lucide-react"

// Mock data - replace with actual API calls
const mockActivity = [
  {
    id: "act-1",
    type: "deposit",
    user: "alice_crypto",
    details: "Deposited $2,500 USDT",
    time: "2 hours ago",
  },
  {
    id: "act-2",
    type: "user",
    user: "bob_investor",
    details: "New user registered",
    time: "5 hours ago",
  },
  {
    id: "act-3",
    type: "stake",
    user: "charlie_hodl",
    details: "Created new staking position",
    time: "6 hours ago",
  },
  {
    id: "act-4",
    type: "alert",
    user: "dave_trader",
    details: "Failed deposit attempt",
    time: "1 day ago",
  },
  {
    id: "act-5",
    type: "deposit",
    user: "eve_blockchain",
    details: "Deposited $6,000 USDT",
    time: "1 day ago",
  },
]

export function AdminRecentActivity({ isLoading }: { isLoading: boolean }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <CreditCard className="h-4 w-4 text-blue-400" />
      case "user":
        return <User className="h-4 w-4 text-green-400" />
      case "stake":
        return <Coins className="h-4 w-4 text-purple-400" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-4">
      {isLoading
        ? Array(5)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))
        : mockActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800">
                {getActivityIcon(activity.type)}
              </div>
              <div>
                <p className="font-medium">{activity.details}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
    </div>
  )
}
