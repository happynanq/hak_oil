import { Table, Input, Button, Space, Form, Flex, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { EditOutlined, SaveOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
// import {  } from '@ant-design/icons';
import ShowStroke from './StrokeRender/ShowStroke';

function handleDateChange(date){
  return date.getFullYear()
}



const searchOptions = [
  { value: 'field', label: 'Месторождение' },
  { value: 'dateResearch', label: 'Дата' },
  // { value: 'address', label: 'Адрес' },
];

function getRandomDate(startDate, endDate) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const randomTime = start + Math.random() * (end - start);
  const date = new Date(randomTime);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}


const EditableTable = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [modal, setModal] = useState(false)

  const [searchText, setSearchText] = useState('');
  const [searchParam, setSearchParam] = useState('field'); // По умолчанию ищем по имени
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [id, setId] = useState(undefined)

  const fetchData = async (params) => {
    setLoading(true);
    
    // Имитация асинхронного запроса
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Здесь должен быть реальный API-запрос
    const { current, pageSize } = params;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    
    // Генерация фейковых данных (в реальном приложении замените на API-запрос)
    const newData = Array.from({ length: pageSize }, (_, i) => ({
      key: start + i,
      field: `Исследование ${start + i + 1}`,
      dateResearch: getRandomDate('2000-01-01', new Date()),
      address: `Address ${start + i + 1}`,
      id:i,
    }));
    console.log("new data: ", newData)
    setData(newData);
    setPagination({
      ...params,
      total: 10000000, // 10^7
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchData(pagination);
  }, []);

  const handleTableChange = (newPagination) => {
    console.log("pagination", newPagination);
    
    fetchData(newPagination);
    setPagination(newPagination);
  };


  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        newData[index] = { ...newData[index], ...row };
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Месторождение',
      dataIndex: 'field',
      key: 'field',
      editable: true,
      render: (text, record) => {
        if (isEditing(record)) {
          return (
            <Form.Item
              name="field"
              rules={[{ required: true, message: 'Введите имя' }]}
            >
              <Input />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: 'Даты исследования',
      dataIndex: 'dateResearch',
      key: 'dateResearch',
      editable: true,
      render: (text, record) => {
        if (isEditing(record)) {
          return (
            <Form.Item
              name="dateResearch"
              rules={[{ required: true, message: 'Введите даты' }]}
            >
              <Input type="date" />
            </Form.Item>
          );
        }
        // console.log("date res:", text);
        
        return String(text);
      },
    },
    {
      title: 'Действия',
      dataIndex: 'actions',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => save(record.key)}
            />
            <Button icon={<CloseOutlined />} onClick={cancel} />
          </Space>
        ) : (
          <Flex style={{justifyContent:'space-between'}} >
            <Button
              style={{marginRight:5}}
              icon={<EditOutlined />}
              onClick={() => edit(record)}
              disabled={editingKey !== ''}
            />
            <Button
              // icon={<EditOutlined />}
              onClick={() => {
                setModal(true)
                setId(record.key)
                // console.log(record.key);
                
              }}
              disabled={editingKey !== ''}
              
            >Открыть исследование</Button>
  
          </Flex>
          
        );
      },
    },
  ];
  // ! HANDLE SEARCH TABLE
  // хочу чтобы 
  const handleSearch = async() => {
    return new Promise(()=>{
      setLoading(true)
      setTimeout(()=>{
        const filteredData = data.filter(item =>
          String(item[searchParam]).toLowerCase().includes(searchText.toLowerCase())
        );
        setData(filteredData);
        setLoading(false)
      }, 1000)
    })
    
  };
  
  const handleReset = () => {
    setSearchText('');
    fetchData(pagination)
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
      <Select
        style={{ width: 120 }}
        value={searchParam}
        onChange={value => setSearchParam(value)}
        options={searchOptions}
      />
      <Input
        placeholder={`Поиск по ${searchParam}`}
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        onPressEnter={handleSearch}
        style={{ width: 200 }}
      />
      <button 
        type="button" 
        onClick={handleSearch}
        style={{ 
          background: '#1890ff', 
          color: 'white', 
          border: 'none', 
          padding: '5px 10px', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        <SearchOutlined /> Поиск
      </button>
      <button 
        type="button" 
        onClick={handleReset}
        style={{ 
          background: '#f5f5f5', 
          color: 'rgba(0, 0, 0, 0.65)', 
          border: '1px solid #d9d9d9', 
          padding: '5px 10px', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Сбросить
      </button>
    </Space>
      <Form form={form} component={false}>
        <Table
        columns={columns}
        dataSource={data}
        rowKey="key"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: true }}
        style={{ margin: '20px' }}
      />
        <Modal width="100%" open={modal} onCancel={()=>setModal(false)} footer={null}>
          <ShowStroke data={data} id={id} columns={columns} pageSize = {pagination.pageSize}/>
        </Modal>
      </Form>
    </div>
  );
};

export default EditableTable;