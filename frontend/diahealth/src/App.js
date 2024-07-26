// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar.js';
import Footer from './Components/Footer.js'
import UserRoutes from './UserRoutes.js'; // Import user-specific routes
import ScheduleAppointments from './pages/ScheduleAppointments';
import ManageAppointments from './pages/ManageAppointments';
import HomePage from './pages/homePage';  // Ensure this path matches the actual file name

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<UserRoutes />} /> {/* Catch-all for user routes */}      
        <Route path="/schedule-appointments" element={<ScheduleAppointments />} />
        <Route path="/manage-appointments" element={<ManageAppointments />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
