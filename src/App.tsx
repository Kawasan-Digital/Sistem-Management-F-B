import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cashier from './pages/Cashier';
import MenuManagement from './pages/MenuManagement';
import Inventory from './pages/Inventory';
import SalesReport from './pages/SalesReport';
import PurchaseReport from './pages/PurchaseReport';
import ExpenseReport from './pages/ExpenseReport';
import CashFlow from './pages/CashFlow';
import ProfitLoss from './pages/ProfitLoss';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/cashier" element={
              <ProtectedRoute>
                <Layout>
                  <Cashier />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/menu" element={
              <ProtectedRoute>
                <Layout>
                  <MenuManagement />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <Layout>
                  <Inventory />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/sales-report" element={
              <ProtectedRoute>
                <Layout>
                  <SalesReport />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/purchase-report" element={
              <ProtectedRoute>
                <Layout>
                  <PurchaseReport />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/expense-report" element={
              <ProtectedRoute>
                <Layout>
                  <ExpenseReport />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/cash-flow" element={
              <ProtectedRoute>
                <Layout>
                  <CashFlow />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profit-loss" element={
              <ProtectedRoute>
                <Layout>
                  <ProfitLoss />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
