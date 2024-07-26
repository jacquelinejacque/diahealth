// src/pages/HomePage.js
import React from 'react';
import Login from '../Components/Users/Login';  // Correct the path to Login component
//import Icon from '../assets/images/Icon.png';  // Correct the path to Icon image

const HomePage = () => {
  // const h2Styles = {
  //   display: 'block',
  //   position: 'relative',
  //   top: '0',
  //   left: '50%',
  //   marginTop: '0',
  //   transform: 'translateX(-50%)',
  //   width: '200px',
  //   height: '200px',
  // };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Welcome To Diahealth</h2>
      <Login style={{ marginTop: '20px' }} />
    </div>
  );
};

export default HomePage;
