// src/components/users/EditUser.js
import React, { useState, useEffect } from 'react';
import '../../assets/css/NewUser.css'; // Reuse the same CSS as NewUser

const EditUser = ({ userId }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    userType: '',
    dateOfBirth: '',
    gender: '',
    medicalDegree: '',
    specialization: '',
    licenseNumber: '',
    jobTitle: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch user details from the server using the userId
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:4600/api/v1/users/details/${userId}`);
        if (!response.ok) throw new Error('User not found');
        const data = await response.json();
        setUser({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: '', // Leave password blank for the user to fill in if they want to change it
          userType: data.userType,
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || '',
          medicalDegree: data.medicalDegree || '',
          specialization: data.specialization || '',
          licenseNumber: data.licenseNumber || '',
          jobTitle: data.jobTitle || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    let formErrors = {};
    if (!user.name) formErrors.name = 'Name is required';
    if (!user.email) formErrors.email = 'Email is required';
    if (!user.phone) formErrors.phone = 'Phone number is required';
    if (user.userType === 'admin' && !user.jobTitle) formErrors.jobTitle = 'Job Title is required';
    if (user.userType === 'doctor') {
      if (!user.medicalDegree) formErrors.medicalDegree = 'Medical Degree is required';
      if (!user.specialization) formErrors.specialization = 'Specialization is required';
      if (!user.licenseNumber) formErrors.licenseNumber = 'License Number is required';
    }
    if (user.userType === 'patient') {
      if (!user.dateOfBirth) formErrors.dateOfBirth = 'Date of Birth is required';
      if (!user.gender) formErrors.gender = 'Gender is required';
    }
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return; // Stop if there are errors

    // Prepare request payload
    const payload = {
      userID: userId,  // Ensure userId is included here
      ...user,
    };
    console.log('Payload:', payload);


    // Send the updated user data to the server
    try {
      const response = await fetch(`http://localhost:4600/api/v1/users/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('User details updated successfully'); // Set success message
        console.log('User updated successfully:', data);
      } else {
        setMessage('Error updating user'); // Set error message
        console.error('Error updating user:', data);
      }
    } catch (error) {
      setMessage('Error updating user'); // Set error message
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="new-user-container">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>        
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div>
          <label>User Type:</label>
          <select
            name="userType"
            value={user.userType}
            onChange={handleChange}
          >
            <option value="" disabled>Select user type</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
          {errors.userType && <p className="error">{errors.userType}</p>}
        </div>
        {user.userType === 'patient' && (
          <>
            <div>
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dateOfBirth"
                value={user.dateOfBirth}
                onChange={handleChange}
              />
              {errors.dateOfBirth && <p className="error">{errors.dateOfBirth}</p>}
            </div>
            <div>
              <label>Gender:</label>
              <input
                type="text"
                name="gender"
                value={user.gender}
                onChange={handleChange}
              />
              {errors.gender && <p className="error">{errors.gender}</p>}
            </div>
          </>
        )}
        {user.userType === 'doctor' && (
          <>
            <div>
              <label>Medical Degree:</label>
              <input
                type="text"
                name="medicalDegree"
                value={user.medicalDegree}
                onChange={handleChange}
              />
              {errors.medicalDegree && <p className="error">{errors.medicalDegree}</p>}
            </div>
            <div>
              <label>Specialization:</label>
              <input
                type="text"
                name="specialization"
                value={user.specialization}
                onChange={handleChange}
              />
              {errors.specialization && <p className="error">{errors.specialization}</p>}
            </div>
            <div>
              <label>License Number:</label>
              <input
                type="text"
                name="licenseNumber"
                value={user.licenseNumber}
                onChange={handleChange}
              />
              {errors.licenseNumber && <p className="error">{errors.licenseNumber}</p>}
            </div>
          </>
        )}
        {user.userType === 'admin' && (
          <div>
            <label>Job Title:</label>
            <input
              type="text"
              name="jobTitle"
              value={user.jobTitle}
              onChange={handleChange}
            />
            {errors.jobTitle && <p className="error">{errors.jobTitle}</p>}
          </div>
        )}
        <button type="submit">Update User</button>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default EditUser;
