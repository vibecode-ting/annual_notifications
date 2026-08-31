import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AuthRoute } from './components/auth/AuthRoute';
import { Navbar } from './components/layout/Navbar';
import Dashboard from './views/Dashboard';
import Employees from './views/Employees';
import Settings from './views/Settings';
import Login from './views/Login';
import AdminUsers from './views/AdminUsers';
import Pricing from './views/Pricing';
import { cn } from './lib/utils';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <div className="min-h-screen flex">
          <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <main 
            className={cn("flex-1 p-8 overflow-auto transition-all duration-300", isSidebarOpen ? "ml-72" : "ml-20")}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/" 
                element={
                  <AuthRoute>
                    <Dashboard />
                  </AuthRoute>
                } 
              />
              <Route 
                path="/employees" 
                element={
                  <AuthRoute>
                    <Employees />
                  </AuthRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <AuthRoute>
                    <Settings />
                  </AuthRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <AuthRoute>
                    <AdminUsers />
                  </AuthRoute>
                } 
              />
              <Route 
                path="/pricing" 
                element={
                  <AuthRoute>
                    <Pricing />
                  </AuthRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}
