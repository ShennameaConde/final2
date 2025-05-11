"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookCopy, Clock, AlertCircle } from "lucide-react"
import { statsApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

type UserStats = {
  totalBooks: number
  activeLoans: number
  overdueBooks: number
  recentLoans: {
    title: string
    checkoutDate: string
    dueDate: string
  }[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsApi.getUserStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading dashboard...</div>
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                <BookCopy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalBooks || 0}</div>
                <p className="text-xs text-muted-foreground">Books available in the library</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeLoans || 0}</div>
                <p className="text-xs text-muted-foreground">Books you currently have on loan</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.overdueBooks || 0}</div>
                <p className="text-xs text-muted-foreground">Books that need to be returned</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Loans</CardTitle>
                <CardDescription>Books you've recently borrowed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentLoans?.length ? (
                    stats.recentLoans.map((loan, i) => (
                      <div key={i} className="flex items-center">
                        <div className="mr-4 rounded-md bg-primary/10 p-2">
                          <BookCopy className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{loan.title}</p>
                          <p className="text-sm text-muted-foreground">Due: {loan.dueDate}</p>
                        </div>
                        <div className="ml-auto text-sm text-muted-foreground">Borrowed: {loan.checkoutDate}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">No recent loans</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="activity" className="h-[400px] flex items-center justify-center text-muted-foreground">
          Activity history coming soon
        </TabsContent>
      </Tabs>
    </div>
  )
}
