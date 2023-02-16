import React from 'react';

import { Tree, Space, Input, Divider } from 'antd';

import './sider-bar.css';

const { Search } = Input;
const { DirectoryTree } = Tree;

const treeData = [
  {
    title: 'default',
    key: '0-0',
    children: [
      { title: 'default 0-0', key: '0-0-0', isLeaf: true },
      { title: 'default 0-1', key: '0-0-1', isLeaf: true },
    ],
  },
  {
    title: '英语 1',
    key: '0-1',
    children: [
      { title: '英语 1-0', key: '0-1-0', isLeaf: true },
      { title: '英语 1-1', key: '0-1-1', isLeaf: true },
    ],
  },
];

const SiderBar = () => {
  const onSearch = () => {
    console.log('search');
  };

  const onSelect = (keys, info) => {
    console.log('Trigger Select', keys, info);
  };

  const onExpand = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };

  return (
    <Space className="sider-bar-wrapper" direction="vertical" size="small" style={{ display: 'flex' }}>
      <Search
        placeholder="site search"
        allowClear
        onSearch={onSearch}
      />
      <Divider
        style={{ margin: '12px 0' }}
      />
      <DirectoryTree
        rootClassName="folder-wrapper"
        multiple
        defaultExpandAll
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={treeData}
      />
    </Space>
  );
};

export default SiderBar;
