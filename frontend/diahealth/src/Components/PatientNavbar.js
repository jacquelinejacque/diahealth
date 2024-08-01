import React from 'react'
import Icon from "../assets/images/Icon.png"
import {Link} from 'react-router-dom'
import '../assets/css/Navbar.css';

function PatientNavbar() {
  return (
    <div className='navbar'>
      <div className='leftSide'>
          <img src={Icon} alt='Icon' />
      </div>
      <div className='rightSide'>
        <Link to='/'>homePage</Link>
        <Link to='/schedule-appointments'>Schedule Appointments</Link>
        <Link to='/medical-records'>Medical Records</Link>
        <Link to='/messages'>Messages</Link>
      </div>

    </div>
  )
}

export default PatientNavbar;