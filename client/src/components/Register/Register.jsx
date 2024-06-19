import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/register', { username, password, role });
      alert('User registered successfully');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='register-container'>
      <form onSubmit={handleSubmit} className='register-form'>
      <h2>Register</h2>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <select value={role} onChange={(e) => setRole(e.target.value)} className='register-dropdown'>
          <option value="user">User</option>
          <option value="teamleader">Team Leader</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
