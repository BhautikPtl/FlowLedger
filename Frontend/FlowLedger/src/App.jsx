import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './PrivateRoute';
import SuperAdminDashboard from './pages/superAdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute url="dashboard">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/superadmindashboard"
          element={
            <PrivateRoute url="superadmindashboard">
              <SuperAdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
