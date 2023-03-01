import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import TodolistContext from './utils/todolist-context';
import Register from './register';
import Login from './login';
import Home from './home';
import Profile from './profile';
import ErrorPage from "./error-page";
import useGlobalContextDispatch from './hooks/use-global-context-dispatch';

import './App.css';

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
  const values = useGlobalContextDispatch();

  return (
    <TodolistContext.Provider value={values}>
      <RouterProvider router={router} />
    </TodolistContext.Provider>
  );
}

export default App;
