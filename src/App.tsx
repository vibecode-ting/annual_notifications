import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthRoute } from './components/auth/AuthRoute';
import { Navbar } from './components/layout/Navbar';
import Dashboard from './views/Dashboard';
import Employees from './views/Employees';
import Settings from './views/Settings';
import Login from './views/Login';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex">
          <Navbar />
          <main className="flex-1 p-8 overflow-auto ml-64">
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
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}
