import React, { useState } from 'react';
import { MapPin, Wrench, Shield, Camera, Zap, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'resident' as 'resident' | 'technician' | 'admin',
    location: '',
    skills: [] as string[]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success = false;
      if (isLogin) {
        success = await login(formData.email, formData.password, formData.role);
      } else {
        success = await register(formData);
      }

      if (!success) {
        setError(isLogin ? 'Invalid credentials' : 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (role: 'resident' | 'technician' | 'admin') => {
    const credentials = {
      resident: { email: 'resident@demo.com', password: 'demo123' },
      technician: { email: 'technician@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'demo123' }
    };
    
    setFormData(prev => ({ 
      ...prev, 
      ...credentials[role], 
      role 
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  IssueAtlas
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Maintenance Management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* Left Side - Hero */}
        <div className="lg:w-1/2 px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Smart Maintenance
                <span className="block text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Report issues instantly with AI-powered classification and automated technician routing
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Camera className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-gray-700">AI Image Classification</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-gray-700">Real-time Status Updates</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-gray-700">Smart Technician Routing</span>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="font-semibold text-gray-900 mb-4">Try Demo Accounts:</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Resident Portal</span>
                  <button
                    onClick={() => demoLogin('resident')}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    Use Demo
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Technician Portal</span>
                  <button
                    onClick={() => demoLogin('technician')}
                    className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
                  >
                    Use Demo
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Admin Portal</span>
                  <button
                    onClick={() => demoLogin('admin')}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
                  >
                    Use Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="lg:w-1/2 px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  {isLogin ? 'Welcome Back' : 'Get Started'}
                </h3>
                <p className="text-gray-600 mt-2">
                  {isLogin ? 'Sign in to your account' : 'Create your account'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'resident', icon: Users, label: 'Resident' },
                      { value: 'technician', icon: Wrench, label: 'Technician' },
                      { value: 'admin', icon: Shield, label: 'Admin' }
                    ].map(({ value, icon: Icon, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: value as any }))}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          formData.role === value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-5 w-5 mx-auto mb-1" />
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                </div>

                {/* Additional fields for registration */}
                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {formData.role === 'resident' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Block A, Apt 301"
                        />
                      </div>
                    )}
                  </>
                )}

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;