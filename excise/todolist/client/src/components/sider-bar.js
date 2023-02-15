import React from 'react';

import { Tree, Space, Input, Divider } from 'antd';

const { Search } = Input;
const { DirectoryTree } = Tree;

const treeData = [
  {
    title: 'parent 0',
    key: '0-0',
    children: [
      { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
      { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
      { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
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
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Search
        placeholder="site search"
        allowClear
        onSearch={onSearch}
        style={{
          width: 200,
        }}
      />
      <Divider />
      <DirectoryTree
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
