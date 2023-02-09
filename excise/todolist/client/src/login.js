import React from 'react';
import {
  useNavigate,
  Link,
} from "react-router-dom";

import { message } from 'antd';

const Register = () => {
  const [form, setForm] = React.useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSumbit = async () => {
    const res = await fetch(
      'http://localhost:8000/user/login',
      {
        method: 'post',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      }
    ).then((res) => res.json());
    if (res.code !== 200) {
      message.error(res.message);
      return { ok: false };
    }
    navigate('/', { replace: true });
    return { ok: true };
  };

  return (
    <div className="login-wrapper">
      <p>
        <label>Username</label>
        <input type="text" name="username" placeholder="please input your username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
      </p>
      <p>
        <label>Password</label>
        <input type="password" name="password" placeholder="please input your password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </p>
      <p>
        <button type="submit" onClick={handleSumbit}>Submit</button>
      </p>
      <p>
        <span>has not an account? now carete it!</span>
        <Link to='/register'>Register</Link>
      </p>
    </div>
  );
};

export default Register;