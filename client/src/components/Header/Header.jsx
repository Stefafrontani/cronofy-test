import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'
const Header = () => {
  return (
    <header style={{ padding: '20px' }}>
      <nav>
        <ul style={{ display: 'flex' }}>
          <li><Link to="/login">LOGIN</Link></li>
          <li><Link to="/availability">AVAILABILITY</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;