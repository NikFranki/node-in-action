import React from 'react';

import { PlusCircleOutlined } from '@ant-design/icons';
import { Tree, Space, Input, Divider, Modal, Form, Cascader, message } from 'antd';

import request from '../utils/request';
import generateNestedFolders from '../utils/generate-nested-folders';
import useContextInfo from '../hooks/use-context-info';
import './sider-bar.css';

const { Search } = Input;
const { DirectoryTree } = Tree;

const SiderBar = () => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();

  const { folders, onFetchFolders } = useContextInfo();
  const [open, setOpen] = React.useState(false);
  const treeData = generateNestedFolders(folders);

  const options = generateNestedFolders(folders, true);

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
    setOpen(true);
  };

  const filter = (inputValue, path) => {
    return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
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
      <Modal
        open={open}
        title={`Add file list`}
        okText="Ok"
        cancelText="Cancel"
        confirmLoading={confirmLoading}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        onOk={() => {
          setConfirmLoading(true);
          form
            .validateFields()
            .then(async (values) => {
              form.resetFields();
              values.parent_id = values.parent_id[values.parent_id.length - 1];
              await request(
                `http://localhost:8000/folders/add`,
                JSON.stringify(values),
              );
              onFetchFolders();
              message.success('Add folder success.');
              setOpen(false);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            }).finally(() => {
              setConfirmLoading(false);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            parent_id: [0],
          }}
          onChange={
            (v) => {
              console.log(11, v);
            }
          }
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
            <Cascader
              options={options}
              placeholder="Please select"
              showSearch={{
                filter,
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default SiderBar;
