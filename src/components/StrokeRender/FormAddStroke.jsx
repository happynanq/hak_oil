import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, message, Flex } from 'antd';
import axios from 'axios';

const AddUsForm = ({ onAddStroke }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // server Res 
      // const response = await axios.post('http://lcoalhost:80000/docs/{}', {
      //   name: values.name,
      //   age: values.age
      // });
      
      const fakeRes = {name:values.name, age:values.age}
      
      message.success('Пользователь успешно добавлен');
      
      // Очистка формы
      form.resetFields();
      
      // Колбэк для обновления состояния в родительском компоненте
      onAddStroke(fakeRes);
    } catch (error) {
      message.error('Ошибка при добавлении пользователя');
      console.error('Error adding user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      style={{ maxWidth: 600 }}
    >
      <Flex >

      <Form.Item
        label="Имя"
        name="name"
        rules={[
          { required: true, message: 'Пожалуйста, введите имя' },
          { min: 2, message: 'Имя должно содержать минимум 2 символа' }
        ]}
      >
        <Input placeholder="Введите имя" />
      </Form.Item>

      <Form.Item
        label="Возраст"
        name="age"
        rules={[
          { required: true, message: 'Пожалуйста, введите возраст' },
          { type: 'number', min: 0, max: 120, message: 'Возраст должен быть от 0 до 120' }
        ]}
      >
        <InputNumber placeholder="Введите возраст" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Добавить
        </Button>
      </Form.Item>
      </Flex>

    </Form>
    
  );
};

export default AddUsForm;