import { Route, Routes } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Login from './page/login'
import Signup from './page/signup'
// import { SignIn, SignUp } from '@clerk/clerk-react'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<p>no page</p>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
