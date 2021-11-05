import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'
const Header = () => {
  return (
    <header style={{ padding: '20px' }}>
      <nav>
        <ul style={{ display: 'flex' }}>
          <li><Link to="/calendarSync">CALENDAR SYNC</Link></li>
          <li><Link to="/dateTimePicker">DATE TIME PICKER</Link></li>
          <li><Link to="/endpoints">ENDPOINTS</Link></li>
          <li><Link to="/events">EVENTS</Link></li>
          <li><Link to="/login">LOGIN</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;