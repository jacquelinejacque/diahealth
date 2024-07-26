import React from 'react'
import InstagramIcon from '../assets/images/instagram-logo.png'
import TwitterIcon from '../assets/images/twitter-logo.png'
import FacebookIcon from '../assets/images/facebook-logo.png'
import LinkedinIcon from '../assets/images/linkedin-logo.png'
import '../assets/css/Footer.css';
function Footer() {
  return (
    <div className='footer'>
        <div className='socialMedia'>
            <img className='img' src={InstagramIcon} alt= 'Instagram' /> 
            <img className='img'src={TwitterIcon} alt='Twitter' />
            <img className='img'src={FacebookIcon} alt='Facebook' />
            <img className='img'src={LinkedinIcon} alt='LinkedIn' />
        </div>
        <p>&copy; 2024 #Diahealth</p>
    </div>
  )
}

export default Footer;