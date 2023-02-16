import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import request from './utils/request';
import TodolistContext from './utils/todolist-context';
import Register from './register';
import Login from './login';
import Home from './home';
import Profile from './profile';
import ErrorPage from "./error-page";
import useFolders from './hooks/use-folders';

import './App.css';

export async function loader() {
  const user = await request(
    'http://localhost:8000/user/searchUser',
    JSON.stringify({})
  );

  return user;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

function App() {
  const [userInfo, setUserInfo] = React.useState({});

  const { folders } = useFolders();

  React.useEffect(() => {
    onUserInfoChange();
  }, []);

  const onUserInfoChange = () => {
    loader().then((user) => {
      setUserInfo(user.data || {});
    });
  };

  const values = {
    userInfo,
    folders,
    onUserInfoChange,
  };

  return (
    <TodolistContext.Provider value={values}>
      <RouterProvider router={router} />
    </TodolistContext.Provider>
  );
}

export default App;
