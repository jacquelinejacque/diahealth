import React from 'react'
import Icon from "../assets/images/Icon.png"
import {Link} from 'react-router-dom'
import '../assets/css/Navbar.css';

function Navbar() {
  return (
    <div className='navbar'>
      <div className='leftSide'>
          <img src={Icon} alt='Icon' />
      </div>
      <div className='rightSide'>
        <Link to='/'>homePage</Link>
        <Link to='/users'>UsersPage</Link>
        <Link to='/schedule-appointments'>ScheduleAppointments</Link>
        <Link to='/manage-appointments'>ManageAppointments</Link>
      </div>

    </div>
  )
}

export default Navbar;