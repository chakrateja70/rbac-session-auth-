import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/login', { username, password }, { withCredentials: true });
      history.push('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='login-container'>
      <form onSubmit={handleSubmit} className='login-form'>
      <h2>Login</h2>
        <div>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' required/>
        </div>
        <div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
