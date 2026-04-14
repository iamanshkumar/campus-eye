import React from 'react'
import { BrowserRouter, Routes, Route ,Navigate } from 'react-router'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import ProtectedRoute from './components/ProtectRoute'
import { useAuth } from './context/AuthContext'

const App = () => {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Toaster position='bottom-right' />
      <Routes>
        <Route path='/' element={<LandingPage></LandingPage>}></Route>
        <Route 
          path='/home' 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/home" replace /> : <LoginPage />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App