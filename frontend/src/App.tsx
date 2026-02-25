import { Route, Routes } from 'react-router'
import './App.css'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { HomePage } from './pages/HomePage'
import { StorePage } from './pages/StorePage'
import { GroceryPage } from './pages/GroceryPage'
import { ProtectedRoute } from './utils/ProtectedRoute'
import Navbar, { type NavBarLink } from './components/Navbar';
import { NotFoundPage } from './pages/NotFoundPage'
import { decodeRole } from './utils/jwtDecoder'
import { AdminPage } from './pages/AdminPage'
import { logoutUser } from './api/auth'
import { ThemeToggle } from './components/ThemeToggle'

export default function App() {
  const links: NavBarLink[] = [
    { text: 'Home', url: '/' },
    { text: 'Store', url: '/store' },
    { text: 'Grocery', url: '/grocery' },
    { text: 'Logout', url: '/login', onClickAction: () => logoutUser() }
  ];

  if (decodeRole() == "Admin") {
    links.push({ text: 'Admin', url: '/admin' });
  }

  return (
    <div>
      <ThemeToggle />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Navbar links={links} />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/store' element={<StorePage />} />
            <Route path='/grocery' element={<GroceryPage />} />
            <Route path='/admin' element={<AdminPage />} />
          </Route>
        </Route>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/*' element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};