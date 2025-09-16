'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User roles enum
export const USER_ROLES = {
  ADMIN: 'admin',
  WARDEN: 'warden',
  OFFICER: 'officer',
  MEDICAL: 'medical',
  VISITOR: 'visitor'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// User interface
export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  department?: string;
  permissions: string[];
}

// Demo users
const DEMO_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    name: 'System Administrator',
    role: USER_ROLES.ADMIN,
    department: 'Administration',
    permissions: ['all']
  },
  {name:'Quality Analyst Pratima maam',
    id:'123',
    username:'Pratima',
    role: USER_ROLES.ADMIN,
    department: 'Administration',
    permissions: ['all']

  },
  {
    id: '2',
    username: 'warden',
    name: 'John Warden',
    role: USER_ROLES.WARDEN,
    department: 'Management',
    permissions: ['inmates', 'staff', 'security', 'reports']
  },
  {
    id: '3',
    username: 'officer1',
    name: 'Officer Smith',
    role: USER_ROLES.OFFICER,
    department: 'Security',
    permissions: ['inmates', 'visitors', 'security']
  },
  {
    id: '4',
    username: 'medical1',
    name: 'Dr. Johnson',
    role: USER_ROLES.MEDICAL,
    department: 'Medical',
    permissions: ['medical', 'inmates']
  },
    {
    id: '5',
    username: 'medical2',
    name: 'Dr. Johnsfdon',
    role: USER_ROLES.MEDICAL,
    department: 'Medical',
    permissions: ['medical', 'inmates']
  }
];

// Demo passwords
const DEMO_PASSWORDS: Record<string, string> = {
  admin: 'admin123',
  pratima: 'Userpratima@123',
  warden: 'warden123',
  officer1: 'officer123',
  medical1: 'medical123',
  medical2: 'medical234'
};

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('prison_management_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('prison_management_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = DEMO_USERS.find(u => u.username === username);
    const correctPassword = DEMO_PASSWORDS[username];

    if (foundUser && password === correctPassword) {
      setUser(foundUser);
      localStorage.setItem('prison_management_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('prison_management_user');
  };

  // Permission checking
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}