// src/components/auth/ResetPasswordForm.js
import React, { useState } from 'react';
import '../../assets/css/NewUser.css'; // Reuse the same CSS as NewUser

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Reset password logic
    console.log('New Password:', newPassword);

    // You can replace this part with an API call to reset the password
    // Example:
    // const response = await fetch('https://your-api-endpoint.com/reset-password', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ newPassword }),
    // });
    // const data = await response.json();
    // if (response.ok) {
    //   console.log('Password reset successfully:', data);
    // } else {
    //   console.error('Error resetting password:', data);
    // }
  };

  return (
    <div className="new-user-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
