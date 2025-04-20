import React, { useState } from 'react';
import { Card, Table } from 'antd';
import AddUserForm from './FormAddStroke';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  const handleUserAdded = (newUser) => {
    setUsers([...users, newUser]);
  };

  const columns = [
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Возраст',
      dataIndex: 'age',
      key: 'age',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="Добавить нового пользователя" style={{ marginBottom: 24 }}>
        <AddUserForm onUserAdded={handleUserAdded} />
      </Card>
      
      <Card title="Список пользователей">
        <Table 
          dataSource={users} 
          columns={columns} 
          rowKey="id" 
          pagination={{ pageSize: 5 }} 
        />
      </Card>
    </div>
  );
};

export default UserManagement;