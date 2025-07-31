import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import ResidentDashboard from './components/ResidentDashboard';
import TechnicianDashboard from './components/TechnicianDashboard';
import AdminDashboard from './components/AdminDashboard';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          user.role === 'resident' ? <ResidentDashboard /> :
          user.role === 'technician' ? <TechnicianDashboard /> :
          <AdminDashboard />
        } />
        <Route path="/resident" element={
          user.role === 'resident' ? <ResidentDashboard /> : <Navigate to="/" />
        } />
        <Route path="/technician" element={
          user.role === 'technician' ? <TechnicianDashboard /> : <Navigate to="/" />
        } />
        <Route path="/admin" element={
          user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />
        } />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;