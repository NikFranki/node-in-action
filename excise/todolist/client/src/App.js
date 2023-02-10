import React from 'react';
import Menu from './menu';
import Todolist from './todolist';
import './App.css';

export async function loader() {
  const user = await fetch(
    'http://localhost:8000/user/searchUser',
    {
      method: 'post',
      credentials: 'include',
    },
  ).then(res => res.json());
  return { user };
}

function App() {
  React.useEffect(() => {
    loader();
  }, []);

  return (
    <div className="App">
      <Menu />
      <Todolist />
    </div>
  );
}

export default App;
