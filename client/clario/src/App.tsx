import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import RegisterForm from './pages/register/RegisterForm';
import LoginForm from './pages/login/LoginForm';
import Dashboard from './pages/dashboard';
import HomePage from './pages/home/HomePage';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        {/*<Route path="/" element={<Home />} />*/}
        <Route path="/auth/register" element={<RegisterForm />} />
        <Route path="/auth/login" element={<LoginForm />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* Private acccess only with JWT token */}
        <Route element={<ProtectedRoute />}>
          <Route path="/user/dashboard" element={<Dashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;