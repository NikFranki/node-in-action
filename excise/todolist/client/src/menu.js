/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link, useLoaderData, useNavigate } from "react-router-dom";

import { Dropdown, Space, Avatar, message } from 'antd';

const Menu = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const userLogined = user.code === 200;

  React.useEffect(() => {
    if (!user.data?.username) {
      message.error('you have not login, please login first.');
      navigate('/login', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleLogout = async () => {
    // TODO: clear login user info
    try {
      await fetch(
        'http://localhost:8000/user/logout',
        {
          method: 'post',
          credentials: 'include',
        },
      ).then((res) => res.json());
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
      label: 'continue',
      key: '3',
    },
  ];

  return (
    <div className="header-menu-wrapper">
      <Link className="home-url" to="/">Home</Link>
      <Dropdown className="avater-dropdown" menu={{ items }} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <Avatar src={user.data?.avatar} title={user.data?.username} />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
};

export default Menu;