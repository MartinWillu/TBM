import { Route, Routes, useNavigate } from 'react-router'
import './App.css'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { HomePage } from './pages/HomePage'
import { StorePage } from './pages/StorePage'
import { GroceryPage } from './pages/GroceryPage'
import { ProtectedRoute } from './utils/ProtectedRoute'
import Navbar from './components/Navbar';
import { logoutUser } from './api/auth'
import { NotFoundPage } from './pages/NotFoundPage'

const App: React.FC = () => {
  const navLinks = [
    { text: 'Home', url: '/' },
    { text: 'Store', url: '/store' },
    { text: 'Grocery', url: '/grocery' },
    // { text: 'Log out', url: '/login'}
  ];

  const navigator = useNavigate();
  const handleLogout = () => {
    logoutUser();           // clear tokens/session/etc
    navigator('/login');     // send the user to login
    console.log('Logged out');
  };


  return (
    <div>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Navbar links={navLinks} onLogout={handleLogout} />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/store' element={<StorePage />} />
            <Route path='/grocery' element={<GroceryPage />} />
          </Route>
        </Route>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/*' element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App
