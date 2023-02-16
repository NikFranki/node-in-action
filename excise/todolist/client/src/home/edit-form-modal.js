import React from 'react';

import { Select, Modal, Input, DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
// import qs from 'qs';

import useContextInfo from '../hooks/use-context-info';

const { TextArea } = Input;

const Edit = ({ todoDetail, mode, onSubmit, onCancel }) => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();

  const { folders } = useContextInfo();
  const options = folders.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  React.useEffect(() => {
    if (todoDetail.id) {
      todoDetail.date = dayjs(new Date(todoDetail.date));
      form.setFieldsValue(todoDetail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoDetail.id]);

  return (
    <Modal
      open={!!mode}
      title={`${mode.slice(0, 1).toUpperCase()}${mode.slice(1).toLowerCase()} Todo`}
      okText="Ok"
      cancelText="Cancel"
      confirmLoading={confirmLoading}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        setConfirmLoading(true);
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            if (todoDetail.id) {
              values.id = todoDetail.id;
            }
            if (values.date instanceof dayjs) {
              values.date = values.date.format('YYYY-MM-DD');
            }
            onSubmit(values);
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
          folder_id: 0,
        }}
      >
        <Form.Item
          name="content"
          label="Title"
          rules={[
            {
              required: true,
              message: 'Please input the title.',
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="date"
          label="Date"
          rules={[
            {
              required: true,
              message: 'Please select the date.',
            },
          ]}
        >
          <DatePicker
            style={{
              width: '100%',
            }}
          />
        </Form.Item>
        <Form.Item
          name="folder_id"
          label="Position"
          rules={[
            {
              required: true,
              message: 'Please select the position.',
            },
          ]}
        >
          <Select
            showSearch
            placeholder="select position"
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            notFoundContent={null}
            options={options}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Edit;