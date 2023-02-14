import React from 'react';

import { Modal, Input, DatePicker, Form } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

const Edit = ({ todoDetail, open, onSubmit, onCancel }) => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (todoDetail) {
      todoDetail.date = dayjs(new Date(todoDetail.date));
      form.setFieldsValue(todoDetail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoDetail]);

  return (
    <Modal
      open={!!open}
      title={`${open.slice(0, 1).toUpperCase()}${open.slice(1).toLowerCase()} Todo`}
      okText="Ok"
      cancelText="Cancel"
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onOk={() => {
        setConfirmLoading(true);
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            values.id = todoDetail.id;
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
          modifier: 'public',
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
      </Form>
    </Modal>
  );
};

export default Edit;