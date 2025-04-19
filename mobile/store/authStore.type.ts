export interface User {
  id?: string
  email?: string
  username?: string
}

export interface Response {
  success: boolean
  message: any
}

export interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  register: (username: string, email: string, password: string) => Promise<Response>
  login: (email: string, password: string) => Promise<Response>
  checkAuth: () => Promise<void>
  logout: () => void
}
