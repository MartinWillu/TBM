import { Route, Routes } from 'react-router'
import './App.css'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { HomePage } from './pages/HomePage'
import { StorePage } from './pages/StorePage'
import { GroceryPage } from './pages/GroceryPage'

function App() {

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/store' element={<StorePage />} />
      <Route path='/grocery' element={<GroceryPage />} />
    </Routes>
  )
}

export default App
