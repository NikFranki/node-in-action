/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link, useNavigate } from "react-router-dom";

import { Dropdown, Space, Avatar, message } from 'antd';

import request from '../utils/request';
import TodolistContext from '../utils/todolist-context';

import './menu.css';

const Menu = () => {
  const navigate = useNavigate();

  const { userInfo } = React.useContext(TodolistContext);
  const { username, avatar } = userInfo;
  const userLogined = userInfo.username;

  const handleLogout = async () => {
    try {
      await request(
        'http://localhost:8000/user/logout',
        JSON.stringify({})
      );
      navigate('/login', { replace: true });
    } catch (error) {
      message.error(error.message);
    }
  };

  const items = [
    ...!userLogined ? [{
      label: <Link to="/login">Login</Link>,
      key: '0',
    }] : [],
    ...userLogined ? [{
      label: <a onClick={handleLogout}>Logout</a>,
      key: '1',
    }] : [],
    {
      type: 'divider',
    },
    {
      label: <Link to="/profile">Profile</Link>,
      key: '3',
    },
  ];

  return (
    <div className="header-menu-wrapper">
      <Dropdown className="avater-dropdown" menu={{ items }} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <Avatar src={avatar} />
          </Space>
        </a>
      </Dropdown>
      <span>{username}</span>
    </div>
  );
};

export default Menu;