import React from 'react';

const DoctorNavbar = () => {
  return (
    <nav>
      <ul>
        <li><a href="/Appointment-Schedule">Appointment Schedule</a></li>
        <li><a href="/doctor">Patient Records </a></li>
          <li><a href="/doctor">Prescribing Module </a></li>
        {/* Add more doctor-specific links here */}
      </ul>
    </nav>
  );
};

export default DoctorNavbar;
