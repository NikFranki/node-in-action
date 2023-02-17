import React from 'react';

import { PlusCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Tree, Space, Input, Divider, Modal, Form, Select, message } from 'antd';

import request from '../utils/request';
import useContextInfo from '../hooks/use-context-info';
import './sider-bar.css';

const { Search } = Input;
const { DirectoryTree } = Tree;

const SiderBar = () => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();

  const { folders, onFetchFolders } = useContextInfo();
  const options = folders.map((item) => ({
    value: item.id,
    label: item.name,
    parent_id: item.parent_id,
  }));
  const generateNestedFolders = (folders) => {
    const map = {};
    for (const item of folders) {
      map[item.id] = { ...item };
    }

    for (const key in map) {
      const value = map[key];
      if (value.parent_id) {
        map[value.parent_id].children = map[value.parent_id].children || [];
        map[value.parent_id].children.push(value);
      }
    }

    const loop = (data = [], prefix = '') => {
      return data.map((item) => {
        const newItem = {
          title: item.name,
          key: `${prefix ? `${prefix}-` : ''}${item.id}`,
          id: item.id,
          parent_id: item.parent_id,
          isLeaf: false,
        };

        if (item.children) {
          newItem.children = loop(item.children, `${item.id}`)
        }
        return newItem;
      });
    };

    const rootFolders = Object.keys(map)
      .filter((key) => !map[key].parent_id)
      .map((key) => map[key]);

    return loop(rootFolders);
  };
  const treeData = generateNestedFolders(folders);

  const onSearch = () => {
    console.log('search');
  };

  const onSelect = (keys, info) => {
    console.log('Trigger Select', keys, info);
  };

  const onExpand = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };

  const onAddFolder = () => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: <div className="folder-name-input">
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
        >
          <Form.Item
            name="name"
            label="Folder Name"
            rules={[
              {
                required: true,
                message: 'Please input the folder name.',
              },
            ]}
          >
            <Input placeholder="folder name" />
          </Form.Item>
          <Form.Item
            name="parent_id"
            label="Parent Folder Name"
          >
            <Select
              showSearch
              placeholder="select folder"
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              notFoundContent={null}
              options={options}
            />
          </Form.Item>
        </Form>
      </div>,
      okText: 'Ok',
      cancelText: 'Cancel',
      okButtonProps: {
        loading: confirmLoading,
      },
      onOk: () => {
        setConfirmLoading(true);
        form
          .validateFields()
          .then(async (values) => {
            form.resetFields();
            await request(
              `http://localhost:8000/folders/add`,
              JSON.stringify(values),
            );
            onFetchFolders();
            message.success('Add folder success.');
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          }).finally(() => {
            setConfirmLoading(false);
          });
      }
    });
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
      <div className="add-file-list-wrapper" onClick={onAddFolder}>
        <PlusCircleOutlined className="add-icon" />
        add file list
      </div>
    </Space>
  );
};

export default SiderBar;
