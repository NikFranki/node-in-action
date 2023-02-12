import React from 'react';

import { Layout, Space } from 'antd';
import dayjs from 'dayjs';

import Menu from '../components/menu';
import Todolist from './todolist';

const { Header, Footer, Content } = Layout;

const headerStyle = {
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
};
const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#f5f5d5',
};
const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
};

function Home() {
  return (
    <div className="App">
      <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
        <Layout>
          <Header style={headerStyle}>
            <span>TODOLIST</span>
            <Menu />
          </Header>
          <Content style={contentStyle}>
            <Todolist />
          </Content>
          <Footer style={footerStyle}>@Copyright reserved by franki & christ {dayjs().format('YYYY')}</Footer>
        </Layout>
      </Space>
    </div>
  );
}

export default Home;