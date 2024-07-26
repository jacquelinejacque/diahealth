import React, { useState } from 'react';
import '../../assets/css/NewUser.css';

const NewUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [medicalDegree, setMedicalDegree] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!name) newErrors.name = 'Name is required.';
    if (!email) newErrors.email = 'Email is required.';
    if (!phone) newErrors.phone = 'Phone is required.';
    if (!password) newErrors.password = 'Password is required.';
    if (!userType) newErrors.userType = 'User type is required.';

    // User type specific validation
    if (userType === 'patient') {
      if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required.';
      if (!gender) newErrors.gender = 'Gender is required.';
    } else if (userType === 'doctor') {
      if (!medicalDegree) newErrors.medicalDegree = 'Medical degree is required.';
      if (!specialization) newErrors.specialization = 'Specialization is required.';
      if (!licenseNumber) newErrors.licenseNumber = 'License number is required.';
    } else if (userType === 'admin') {
      if (!jobTitle) newErrors.jobTitle = 'Job title is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const userData = {
      name,
      email,
      phone,
      password,
      userType,
      dateOfBirth,
      gender,
      medicalDegree,
      specialization,
      licenseNumber,
      jobTitle,
    };
    
    console.log('New user data:', userData);

    try {
      const response = await fetch('http://localhost:4600/api/v1/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      
      if (response.ok) {
        console.log('User created successfully:', data);
        alert('User created successfully!');
      } else {
        console.error('Error creating user:', data);
        alert('Error creating user: ' + data.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Fetch error: ' + error.message);
    }
  };

  return (
    <div className="new-user-container">
      <h2>Create New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>        
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div>
          <label>User Type:</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="" disabled>Select user type</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
          {errors.userType && <p className="error">{errors.userType}</p>}
        </div>
        {userType === 'patient' && (
          <>
            <div>
              <label>Date of Birth:</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
              {errors.dateOfBirth && <p className="error">{errors.dateOfBirth}</p>}
            </div>
            <div>
              <label>Gender:</label>
              <input
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
              {errors.gender && <p className="error">{errors.gender}</p>}
            </div>
          </>
        )}
        {userType === 'doctor' && (
          <>
            <div>
              <label>Medical Degree:</label>
              <input
                type="text"
                value={medicalDegree}
                onChange={(e) => setMedicalDegree(e.target.value)}
              />
              {errors.medicalDegree && <p className="error">{errors.medicalDegree}</p>}
            </div>
            <div>
              <label>Specialization:</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
              {errors.specialization && <p className="error">{errors.specialization}</p>}
            </div>
            <div>
              <label>License Number:</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
              />
              {errors.licenseNumber && <p className="error">{errors.licenseNumber}</p>}
            </div>
          </>
        )}
        {userType === 'admin' && (
          <div>
            <label>Job Title:</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
            {errors.jobTitle && <p className="error">{errors.jobTitle}</p>}
          </div>
        )}
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default NewUser;
