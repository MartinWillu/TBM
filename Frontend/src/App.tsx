import { Route, Routes } from 'react-router'
import './App.css'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { HomePage } from './pages/HomePage'
import { StorePage } from './pages/StorePage'
import { GroceryPage } from './pages/GroceryPage'
import { ProtectedRoute } from './utils/ProtectedRoute'

function App() {

  return (
    <Routes>

      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/store/:id' element={<StorePage />} />
        <Route path='/grocery/:id' element={<GroceryPage />} />
      </Route>

      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

    </Routes>
  )
}

export default App
