"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Wallet, CreditCard } from "lucide-react"

// Mock data - replace with actual data from your API
const activityData = [
  {
    id: "act-1",
    type: "STAKE",
    amount: 1500,
    date: "2023-02-10T00:00:00Z",
    details: "Staked 1500 USDR in Silver Plan",
  },
  {
    id: "act-2",
    type: "STAKE",
    amount: 1000,
    date: "2023-03-05T00:00:00Z",
    details: "Staked 1000 USDR in Bronze Plan",
  },
  {
    id: "act-3",
    type: "REWARD",
    amount: 45,
    date: "2023-04-10T00:00:00Z",
    details: "Claimed 45 USDR rewards",
  },
  {
    id: "act-4",
    type: "REWARD",
    amount: 30,
    date: "2023-05-15T00:00:00Z",
    details: "Claimed 30 USDR rewards",
  },
  {
    id: "act-5",
    type: "REFERRAL",
    amount: 25,
    date: "2023-06-20T00:00:00Z",
    details: "Referral bonus from user123",
  },
]

const ActivityTab = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="border-0 glass-effect">
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
        <CardDescription>Track your recent transactions and account activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityData.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                    activity.type === "STAKE"
                      ? "bg-purple-500/20 text-purple-400"
                      : activity.type === "REWARD"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {activity.type === "STAKE" ? <Wallet className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-medium">{activity.details}</p>
                  <p className="text-sm text-gray-400">{formatDate(activity.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${activity.type === "STAKE" ? "" : "text-green-500"}`}>
                  {activity.type === "STAKE" ? "-" : "+"} ${activity.amount}
                </div>
                <div className="text-sm text-gray-400">{activity.type}</div>
              </div>
            </div>
          ))}

          {activityData.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No activity recorded yet.</p>
              <p className="mt-2">Your transactions will appear here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ActivityTab
