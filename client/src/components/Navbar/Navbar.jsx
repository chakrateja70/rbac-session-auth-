import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'

const Navbar = () => {
  return (
    <div className='nav-container'>
      <Link to={"/login"} className='link-item'>Login</Link>
      <Link to={"/register"} className='link-item'>Register</Link>
    </div>
  )
}

export default Navbar
