import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/UsersPage.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users from the server
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4600/api/v1/users/list');
        const data = await response.json();
        // Ensure data is an array
        if (Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          console.error('Fetched data is not an array:', data);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    navigate('/new-user');
  };

  const handleEditUser = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  const handleResetPassword = (userId) => {
    navigate(`/reset-password/${userId}`);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="users-page-container">
      <div className="header">
        <button className="add-user-button" onClick={handleAddUser}>Add User</button>
        <input
          type="text"
          className="search-bar"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Account Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.userID}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.userType}</td>
              <td>
                <button onClick={() => handleEditUser(user.userID)}>Edit</button>
                <button onClick={() => handleResetPassword(user.userID)}>Reset Password</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
