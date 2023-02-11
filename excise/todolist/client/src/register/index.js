import React from 'react';
import {
  useNavigate,
} from "react-router-dom";

const Register = () => {
  const [form, setForm] = React.useState({ username: '', password: '', repassword: '', avatar: null});
  const navigate = useNavigate();

  const handleSumbit = async () => {
    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('password', form.password);
    formData.append('repassword', form.repassword);
    formData.append('avatar', form.avatar);
    const res = await fetch(
      'http://localhost:8000/user/register',
      {
        method: 'post',
        credentials: 'include',
        body: formData,
      }
    ).then((res) => res.json());
    if (res.code !== 200) {
      console.log(res.message);
      return { ok: false };
    }
    navigate('/login');
    return { ok: true };
  };

  return (
    <div className="register-wrapper">
      {/* <form method="post" encType="multipart/form-data" action="http://localhost:8000/user/register">
        <p>
          <label>Username</label>
          <input type="text" name="username" placeholder="please input your username" />
        </p>
        <p>
          <label>Password</label>
          <input type="password" name="password" placeholder="please input your password" />
        </p>
        <p>
          <label>Identity Password</label>
          <input type="password" name="repassword" placeholder="please input your username again" />
        </p>
        <p>
          <label>Avatar</label>
          <input type="file" name="image" accept="image/*" />
        </p>
        <p>
          <button type="submit">Submit</button>
        </p>
      </form> */}
      <p>
        <label>Username</label>
        <input type="text" name="username" placeholder="please input your username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
      </p>
      <p>
        <label>Password</label>
        <input type="password" name="password" placeholder="please input your password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </p>
      <p>
        <label>Identity Password</label>
        <input type="password" name="repassword" placeholder="please input your username again" onChange={(e) => setForm({ ...form, repassword: e.target.value })} />
      </p>
      <p>
        <label>Avatar</label>
        <input type="file" name="avatar" accept="image/*" onChange={(e) => setForm({ ...form, avatar: e.target.files[0] })} />
      </p>
      <p>
        <button onClick={handleSumbit}>Submit</button>
      </p>
    </div>
  );
};

export default Register;