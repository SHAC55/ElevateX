import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Landingpage from './Pages/Landingpage'
import Login from './Pages/Login'
import Signup from './Pages/Signup'

const App = () => {
  return (
   <>
   <Routes>
    <Route path='/' element={<Landingpage/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/signup' element={<Signup/>}/>
   </Routes>
   </>
  )
}

export default App