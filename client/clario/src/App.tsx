import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import RegisterForm from './pages/register/RegisterForm';
import LoginForm from './pages/login/LoginForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/register" element={<RegisterForm />} />
        <Route path="/auth/login" element={<LoginForm />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;