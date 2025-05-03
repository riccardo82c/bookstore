export interface IUser {
  username: string
  email: string
  profileImage: string
  createdAt: string
}

export interface IBook {
  _id: string,
  title: string,
  caption: string,
  image: string,
  rating: number,
  user: IUser,
  createdAt: string,
  updatedAt: string,
}

export interface BooksResponse {
  books: IBook[]
  currentPage: number
  totalBooks: number
  totalPage: number
  message?: string
}

export interface Response {
  success: boolean
  message: any
}

export interface AuthStore {
  user: IUser | null
  token: string | null
  isLoading: boolean
  isCheckingAuth: boolean
  register: (username: string, email: string, password: string) => Promise<Response>
  login: (email: string, password: string) => Promise<Response>
  checkAuth: () => Promise<void>
  logout: () => void
}
