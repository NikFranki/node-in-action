/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link, useLoaderData, useNavigate } from "react-router-dom";

import { Dropdown, Space, Avatar } from 'antd';

const Menu = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const userLogined = user.code === 200;

  React.useEffect(() => {
    if (!user.data?.avatar) {
      navigate('/login', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleLogout = () => {
    // TODO: clear login user info
    navigate('/login', { replace: true });
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