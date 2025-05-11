const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Mock data for development when backend is not available
const mockData = {
  books: [
    {
      id: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "9780061120084",
      category: "Fiction",
      status: "Available",
      publishedYear: 1960,
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      isbn: "9780451524935",
      category: "Science Fiction",
      status: "Loaned",
      publishedYear: 1949,
    },
    {
      id: 3,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "9780743273565",
      category: "Fiction",
      status: "Available",
      publishedYear: 1925,
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      isbn: "9780141439518",
      category: "Romance",
      status: "Available",
      publishedYear: 1813,
    },
    {
      id: 5,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      isbn: "9780547928227",
      category: "Fantasy",
      status: "Loaned",
      publishedYear: 1937,
    },
  ],
  categories: [
    { id: 1, name: "Fiction", description: "Novels and short stories", bookCount: 145 },
    { id: 2, name: "Science Fiction", description: "Fiction with futuristic concepts", bookCount: 87 },
    { id: 3, name: "Fantasy", description: "Fiction with magical elements", bookCount: 112 },
    { id: 4, name: "Romance", description: "Fiction focusing on relationships", bookCount: 94 },
    { id: 5, name: "Mystery", description: "Fiction dealing with puzzles or crimes", bookCount: 76 },
  ],
  loans: [
    {
      id: 1,
      bookTitle: "1984",
      patron: "James Smith",
      checkoutDate: "2023-05-05",
      dueDate: "2023-05-19",
      status: "Loaned",
      returnDate: null,
    },
    {
      id: 2,
      bookTitle: "The Great Gatsby",
      patron: "Sophia Brown",
      checkoutDate: "2023-05-10",
      dueDate: "2023-05-24",
      status: "Overdue",
      returnDate: null,
    },
    {
      id: 3,
      bookTitle: "The Hobbit",
      patron: "Olivia Johnson",
      checkoutDate: "2023-05-15",
      dueDate: "2023-05-29",
      status: "Loaned",
      returnDate: null,
    },
  ],
  adminStats: {
    totalBooks: 635,
    registeredPatrons: 248,
    activeLoans: 87,
    overdueBooks: 12,
    recentLoans: [
      { title: "The Alchemist", patron: "Emma Wilson", time: "2 hours ago" },
      { title: "Dune", patron: "James Smith", time: "5 hours ago" },
      { title: "The Silent Patient", patron: "Sophia Brown", time: "Yesterday" },
    ],
  },
  userStats: {
    totalBooks: 635,
    activeLoans: 2,
    overdueBooks: 1,
    recentLoans: [
      { title: "1984", checkoutDate: "May 5, 2023", dueDate: "May 19, 2023" },
      { title: "The Hobbit", checkoutDate: "May 15, 2023", dueDate: "May 29, 2023" },
    ],
  },
}

// Check if we should use mock data
const useMockData = () => {
  return process.env.NEXT_PUBLIC_MOCK_API === "true" || (typeof window !== "undefined" && !window.fetch)
}

// Generic fetch function with authentication
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // If we're using mock data, return the appropriate mock response
  if (useMockData()) {
    return mockFetch(endpoint, options)
  }

  const url = `${API_URL}${endpoint}`

  // Set default headers
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  }

  // Include credentials for cookies
  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  }

  try {
    const response = await fetch(url, config)

    // Handle unauthenticated responses
    if (response.status === 401) {
      // Redirect to login or handle as needed
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      throw new Error("Unauthenticated")
    }

    // Parse JSON response
    const data = await response.json()

    // Handle API errors
    if (!response.ok) {
      throw new Error(data.message || "API request failed")
    }

    return data
  } catch (error) {
    console.error("API request error:", error)

    // If we're in development, fall back to mock data
    if (process.env.NODE_ENV === "development") {
      console.log("Falling back to mock data")
      return mockFetch(endpoint, options)
    }

    throw error
  }
}

// Mock fetch function for development
function mockFetch(endpoint: string, options: RequestInit = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Books endpoints
      if (endpoint === "/api/books") {
        resolve({ data: mockData.books })
      }
      // Categories endpoints
      else if (endpoint === "/api/categories") {
        resolve({ data: mockData.categories })
      }
      // Loans endpoints
      else if (endpoint === "/api/loans" || endpoint === "/api/user/loans") {
        resolve({ data: mockData.loans })
      }
      // Stats endpoints
      else if (endpoint === "/api/admin/stats") {
        resolve(mockData.adminStats)
      } else if (endpoint === "/api/user/stats") {
        resolve(mockData.userStats)
      }
      // Default empty response
      else {
        resolve({ success: true })
      }
    }, 300) // Simulate network delay
  })
}

// Books API
export const booksApi = {
  getAll: async (params = {}) => {
    const response = await fetchWithAuth(`/api/books?${new URLSearchParams(params as Record<string, string>)}`)
    // Handle both direct array responses and { data: [...] } responses
    return Array.isArray(response) ? response : response.data || []
  },
  getById: (id: number) => fetchWithAuth(`/api/books/${id}`),
  create: (data: any) => fetchWithAuth("/api/books", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchWithAuth(`/api/books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => fetchWithAuth(`/api/books/${id}`, { method: "DELETE" }),
}

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const response = await fetchWithAuth("/api/categories")
    // Handle both direct array responses and { data: [...] } responses
    return Array.isArray(response) ? response : response.data || []
  },
  getById: (id: number) => fetchWithAuth(`/api/categories/${id}`),
  create: (data: any) => fetchWithAuth("/api/categories", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    fetchWithAuth(`/api/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => fetchWithAuth(`/api/categories/${id}`, { method: "DELETE" }),
}

// Loans API
export const loansApi = {
  getAll: (params = {}) => fetchWithAuth(`/api/loans?${new URLSearchParams(params as Record<string, string>)}`),
  getById: (id: number) => fetchWithAuth(`/api/loans/${id}`),
  create: (data: any) => fetchWithAuth("/api/loans", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchWithAuth(`/api/loans/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  returnBook: (id: number) => fetchWithAuth(`/api/loans/${id}/return`, { method: "POST" }),
  getUserLoans: () => fetchWithAuth("/api/user/loans"),
}

// Users/Patrons API (admin only)
export const usersApi = {
  getAll: () => fetchWithAuth("/api/users"),
  getById: (id: number) => fetchWithAuth(`/api/users/${id}`),
  create: (data: any) => fetchWithAuth("/api/users", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchWithAuth(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => fetchWithAuth(`/api/users/${id}`, { method: "DELETE" }),
}

// Dashboard stats
export const statsApi = {
  getAdminStats: () => fetchWithAuth("/api/admin/stats"),
  getUserStats: () => fetchWithAuth("/api/user/stats"),
}
