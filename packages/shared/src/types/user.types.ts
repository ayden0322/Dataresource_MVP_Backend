export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

