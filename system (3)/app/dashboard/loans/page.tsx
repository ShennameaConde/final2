"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Search, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample loan data
const initialLoans = [
  {
    id: "1",
    bookTitle: "To Kill a Mockingbird",
    patron: "Emma Wilson",
    checkoutDate: "2023-05-01",
    dueDate: "2023-05-15",
    status: "Returned",
    returnDate: "2023-05-14",
  },
  {
    id: "2",
    bookTitle: "1984",
    patron: "James Smith",
    checkoutDate: "2023-05-05",
    dueDate: "2023-05-19",
    status: "Loaned",
    returnDate: null,
  },
  {
    id: "3",
    bookTitle: "The Great Gatsby",
    patron: "Sophia Brown",
    checkoutDate: "2023-05-10",
    dueDate: "2023-05-24",
    status: "Overdue",
    returnDate: null,
  },
  {
    id: "4",
    bookTitle: "Pride and Prejudice",
    patron: "William Davis",
    checkoutDate: "2023-05-12",
    dueDate: "2023-05-26",
    status: "Loaned",
    returnDate: null,
  },
  {
    id: "5",
    bookTitle: "The Hobbit",
    patron: "Olivia Johnson",
    checkoutDate: "2023-05-15",
    dueDate: "2023-05-29",
    status: "Loaned",
    returnDate: null,
  },
]

export default function LoansPage() {
  const [loans, setLoans] = useState(initialLoans)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredLoans = loans.filter(
    (loan) =>
      (loan.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.patron.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || loan.status === statusFilter),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Returned":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "Loaned":
        return <Clock className="h-4 w-4 text-amber-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Returned":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Returned
          </Badge>
        )
      case "Overdue":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Overdue
          </Badge>
        )
      case "Loaned":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Loaned
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Loans</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Loan
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Loan Management</CardTitle>
          <CardDescription>Track and manage book loans, returns, and overdue items.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by book title or patron..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Loaned">Loaned</SelectItem>
                <SelectItem value="Returned">Returned</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Patron</TableHead>
                  <TableHead>Checkout Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.length > 0 ? (
                  filteredLoans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">{loan.bookTitle}</TableCell>
                      <TableCell>{loan.patron}</TableCell>
                      <TableCell>{loan.checkoutDate}</TableCell>
                      <TableCell>{loan.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(loan.status)}
                          {getStatusBadge(loan.status)}
                        </div>
                      </TableCell>
                      <TableCell>{loan.returnDate || "-"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            {loan.status !== "Returned" && <DropdownMenuItem>Mark as returned</DropdownMenuItem>}
                            {loan.status === "Loaned" && <DropdownMenuItem>Extend loan</DropdownMenuItem>}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Cancel loan</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No loans found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
