import { Route, Routes } from 'react-router'
import './App.css'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { HomePage } from './pages/HomePage'
import { StorePage } from './pages/StorePage'
import { GroceryPage } from './pages/GroceryPage'
import { ProtectedRoute } from './utils/ProtectedRoute'
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const navLinks = [
    { text: 'Home', url: '/' },
    { text: 'Store', url: '/store' },
    { text: 'Grocery', url: '/grocery' },
  ];

  return (
    <div>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={ <Navbar links={navLinks} />}>
              <Route path='/' element={<HomePage />} />
              <Route path='/store' element={<StorePage />} />
              <Route path='/grocery' element={<GroceryPage />} />
            </Route>
          </Route>
          
           <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
        </Routes>
    </div>
  );
};

export default App
