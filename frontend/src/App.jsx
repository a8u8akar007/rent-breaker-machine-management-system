import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppShell from './components/AppShell';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Machines from './pages/Machines';
import Customers from './pages/Customers';
import Rentals from './pages/Rentals';
import Maintenance from './pages/Maintenance';

// Simple wrapper for protected routes
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/machines" element={<PrivateRoute><AppShell title="Machine Fleet" subtitle="Fleet · Machines"><Machines /></AppShell></PrivateRoute>} />
        <Route path="/customers" element={<PrivateRoute><AppShell title="Customer Directory" subtitle="Fleet · Customers"><Customers /></AppShell></PrivateRoute>} />
        <Route path="/rentals" element={<PrivateRoute><AppShell title="Rental Agreements" subtitle="Fleet · Rentals"><Rentals /></AppShell></PrivateRoute>} />
        <Route path="/maintenance" element={<PrivateRoute><AppShell title="Maintenance Logs" subtitle="Fleet · Maintenance"><Maintenance /></AppShell></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
