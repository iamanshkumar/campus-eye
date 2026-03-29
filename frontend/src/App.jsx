import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position='bottom-right' />
      <Routes>
        <Route path='/' element={<LandingPage></LandingPage>}></Route>
        <Route path='/home' element={<HomePage></HomePage>}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App