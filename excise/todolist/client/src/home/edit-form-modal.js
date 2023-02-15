import React from 'react';

import { Modal, Input, DatePicker, Form } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

const Edit = ({ todoDetail, mode, onSubmit, onCancel }) => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();


  React.useEffect(() => {
    if (todoDetail.id) {
      todoDetail.date = dayjs(new Date(todoDetail.date));
      form.setFieldsValue(todoDetail);
    }

    return () => {
      form.resetFields();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoDetail.id]);

  return (
    <Modal
      open={!!mode}
      title={`${mode.slice(0, 1).toUpperCase()}${mode.slice(1).toLowerCase()} Todo`}
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