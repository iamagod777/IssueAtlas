import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'resident' | 'technician' | 'admin';
  location?: string;
  skills?: string[];
  available?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const demoUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'John Resident',
    email: 'resident@demo.com',
    role: 'resident',
    location: 'Block A, Apt 301',
    password: 'demo123'
  },
  {
    id: '2',
    name: 'Mike Technician',
    email: 'technician@demo.com',
    role: 'technician',
    skills: ['Plumbing', 'Electrical'],
    available: true,
    password: 'demo123'
  },
  {
    id: '3',
    name: 'Sarah Admin',
    email: 'admin@demo.com',
    role: 'admin',
    password: 'demo123'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    const foundUser = demoUsers.find(
      u => u.email === email && u.password === password && u.role === role
    );
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    // In a real app, this would make an API call
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'resident',
      location: userData.location,
      skills: userData.skills,
      available: userData.available
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Load user from localStorage on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}