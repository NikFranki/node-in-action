/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link, useLoaderData, useNavigate } from "react-router-dom";

import { Dropdown, Space, Avatar, message } from 'antd';

import request from '../utils/request';

import './menu.css';

const Menu = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();

  const { code, data = {} } = user;
  const { username, avatar } = data;
  const userLogined = code === 200;

  React.useEffect(() => {
    if (!user.data?.username) {
      message.error('you have not login, please login first.');
      navigate('/login', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
      label: 'Profile',
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