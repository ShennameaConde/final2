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
import { MoreHorizontal, Plus, Search, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Sample patron data
const initialPatrons = [
  {
    id: "1",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    membershipId: "MEM-001",
    joinDate: "2022-01-15",
    status: "Active",
    booksLoaned: 2,
  },
  {
    id: "2",
    name: "James Smith",
    email: "james.smith@example.com",
    membershipId: "MEM-002",
    joinDate: "2022-02-20",
    status: "Active",
    booksLoaned: 1,
  },
  {
    id: "3",
    name: "Sophia Brown",
    email: "sophia.brown@example.com",
    membershipId: "MEM-003",
    joinDate: "2022-03-10",
    status: "Inactive",
    booksLoaned: 0,
  },
  {
    id: "4",
    name: "William Davis",
    email: "william.davis@example.com",
    membershipId: "MEM-004",
    joinDate: "2022-04-05",
    status: "Active",
    booksLoaned: 3,
  },
  {
    id: "5",
    name: "Olivia Johnson",
    email: "olivia.johnson@example.com",
    membershipId: "MEM-005",
    joinDate: "2022-05-12",
    status: "Active",
    booksLoaned: 0,
  },
]

export default function PatronsPage() {
  const [patrons, setPatrons] = useState(initialPatrons)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatrons = patrons.filter(
    (patron) =>
      patron.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patron.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patron.membershipId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Patrons</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Patron
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Patron Management</CardTitle>
          <CardDescription>Manage library members and their borrowing privileges.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search patrons..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Membership ID</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Books Loaned</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatrons.length > 0 ? (
                  filteredPatrons.map((patron) => (
                    <TableRow key={patron.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          {patron.name}
                        </div>
                      </TableCell>
                      <TableCell>{patron.email}</TableCell>
                      <TableCell>{patron.membershipId}</TableCell>
                      <TableCell>{patron.joinDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={patron.status === "Active" ? "outline" : "secondary"}
                          className={patron.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                        >
                          {patron.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{patron.booksLoaned}</TableCell>
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
                            <DropdownMenuItem>Edit patron</DropdownMenuItem>
                            <DropdownMenuItem>View loan history</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No patrons found.
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
