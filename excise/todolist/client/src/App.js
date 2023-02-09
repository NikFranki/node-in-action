import React from 'react';
import Menu from './menu';
import Todolist from './todolist';
import './App.css';

export async function loader() {
  const user = await fetch(
    'http://localhost:8000/user/login',
    {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'franki',
        password: '123',
      }),
    }
  ).then(res => res.json());
  return { user };
}

function App() {
  return (
    <div className="App">
      <Menu />
      <Todolist />
    </div>
  );
}

export default App;
