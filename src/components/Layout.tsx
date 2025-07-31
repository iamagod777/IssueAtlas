import React, { useState } from 'react';
import { MapPin, Bell, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'resident': return 'from-blue-600 to-indigo-600';
      case 'technician': return 'from-green-600 to-emerald-600';
      case 'admin': return 'from-purple-600 to-violet-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'resident': return 'bg-blue-100 text-blue-800';
      case 'technician': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 bg-gradient-to-r ${getRoleColor(user?.role || '')} rounded-xl`}>
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold bg-gradient-to-r ${getRoleColor(user?.role || '')} bg-clip-text text-transparent`}>
                  IssueAtlas
                </h1>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleBadgeColor(user?.role || '')}`}>
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Portal
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Bell className="h-5 w-5 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors" />
                  <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-gradient-to-r ${getRoleColor(user?.role || '')} rounded-full`}>
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{user?.name}</div>
                    <div className="text-gray-500">{user?.email}</div>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-gradient-to-r ${getRoleColor(user?.role || '')} rounded-full`}>
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user?.name}</div>
                  <div className="text-gray-500">{user?.email}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Notifications</span>
                </div>
                <span className="h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;