// src/Routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UsersPage from './pages/UsersPage';
import NewUser from './Components/Users/NewUser';
import EditUser from './Components/Users/EditUser'; // assuming you have this component
import ResetPassword from './Components/Users/ResetPassword';

function UserRoutes() {
  return (
    <Routes>
      <Route path="/users" element={<UsersPage />} />
      <Route path="/new-user" element={<NewUser />} />
      <Route path="/edit-user/:userId" element={<EditUser />} />
      <Route path='/reset-password/:userId' element={<ResetPassword />} />
      
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default UserRoutes;