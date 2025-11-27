import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export type UserRole = 'admin' | 'manager' | 'staff'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface PendingUser {
  id: string
  email: string
  name: string
  registeredAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface StaffUser {
  id: string
  email: string
  name: string
  role: UserRole
  assignedAt: string
  status: 'active' | 'inactive'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (requiredRole: UserRole) => boolean
  isLoading: boolean
  pendingUsers: PendingUser[]
  staffUsers: StaffUser[]
  approveUser: (userId: string) => Promise<void>
  rejectUser: (userId: string) => Promise<void>
  updateStaffRole: (userId: string, role: UserRole) => Promise<void>
  toggleStaffStatus: (userId: string) => Promise<void>
  registerUser: (email: string, name: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([])

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('desktopUser')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('desktopUser')
      }
    }

    // Load users data
    loadUsers()
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const dbUser = await prisma.desktopUser.findUnique({
        where: { email }
      })

      if (!dbUser || dbUser.status !== 'active') {
        return false
      }

      const isValidPassword = await bcrypt.compare(password, dbUser.password)
      if (!isValidPassword) {
        return false
      }

      const userData: User = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role as UserRole
      }

      setUser(userData)
      localStorage.setItem('desktopUser', JSON.stringify(userData))
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('desktopUser')
  }

  const loadUsers = async () => {
    try {
      const [pending, staff] = await Promise.all([
        prisma.pendingUser.findMany({
          where: { status: 'pending' },
          orderBy: { registeredAt: 'desc' }
        }),
        prisma.desktopUser.findMany({
          orderBy: { assignedAt: 'desc' }
        })
      ])

      const formattedPending: PendingUser[] = pending.map((p: any) => ({
        id: p.id,
        email: p.email,
        name: p.name,
        registeredAt: p.registeredAt.toISOString().split('T')[0],
        status: p.status as 'pending' | 'approved' | 'rejected'
      }))

      const formattedStaff: StaffUser[] = staff.map((s: any) => ({
        id: s.id,
        email: s.email,
        name: s.name,
        role: s.role as UserRole,
        assignedAt: s.assignedAt.toISOString().split('T')[0],
        status: s.status as 'active' | 'inactive'
      }))

      setPendingUsers(formattedPending)
      setStaffUsers(formattedStaff)
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const registerUser = async (email: string, name: string, password: string): Promise<boolean> => {
    try {
      // Check if email already exists
      const existingPending = await prisma.pendingUser.findUnique({ where: { email } })
      const existingStaff = await prisma.desktopUser.findUnique({ where: { email } })

      if (existingPending || existingStaff) {
        return false // Email already registered
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      await prisma.pendingUser.create({
        data: {
          email,
          name,
          password: hashedPassword,
          registeredAt: new Date(),
          status: 'pending'
        }
      })

      await loadUsers() // Refresh the lists
      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const approveUser = async (userId: string): Promise<void> => {
    try {
      const pendingUser = await prisma.pendingUser.findUnique({
        where: { id: userId }
      })

      if (!pendingUser) return

      // Update pending user status
      await prisma.pendingUser.update({
        where: { id: userId },
        data: { status: 'approved' }
      })

      // Add to staff with default role
      await prisma.desktopUser.create({
        data: {
          email: pendingUser.email,
          name: pendingUser.name,
          password: pendingUser.password,
          role: 'staff',
          status: 'active',
          assignedAt: new Date()
        }
      })

      await loadUsers() // Refresh the lists
    } catch (error) {
      console.error('Error approving user:', error)
      throw error
    }
  }

  const rejectUser = async (userId: string): Promise<void> => {
    try {
      await prisma.pendingUser.update({
        where: { id: userId },
        data: { status: 'rejected' }
      })

      await loadUsers() // Refresh the lists
    } catch (error) {
      console.error('Error rejecting user:', error)
      throw error
    }
  }

  const updateStaffRole = async (userId: string, role: UserRole): Promise<void> => {
    try {
      await prisma.desktopUser.update({
        where: { id: userId },
        data: { role }
      })

      await loadUsers() // Refresh the lists
    } catch (error) {
      console.error('Error updating staff role:', error)
      throw error
    }
  }

  const toggleStaffStatus = async (userId: string): Promise<void> => {
    try {
      const staffUser = await prisma.desktopUser.findUnique({
        where: { id: userId }
      })

      if (!staffUser) return

      const newStatus = staffUser.status === 'active' ? 'inactive' : 'active'

      await prisma.desktopUser.update({
        where: { id: userId },
        data: { status: newStatus }
      })

      await loadUsers() // Refresh the lists
    } catch (error) {
      console.error('Error toggling staff status:', error)
      throw error
    }
  }

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false

    const roleHierarchy: Record<UserRole, number> = {
      staff: 1,
      manager: 3, // Manager has same level as admin
      admin: 3
    }

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    isLoading,
    pendingUsers,
    staffUsers,
    approveUser,
    rejectUser,
    updateStaffRole,
    toggleStaffStatus,
    registerUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
