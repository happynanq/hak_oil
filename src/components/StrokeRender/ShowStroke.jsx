import React, { useEffect, useState } from 'react';
import { Table, Input, Space, Select, Form, Modal, Button, Flex } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AddUsForm from './FormAddStroke';
import Chart from './Charts/Chart';





const ShowStroke = ({id}) => {
  // Исходные данные
  
  // !def table
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [modal, setModal] = useState(false)

  // Состояния компонента
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchParam, setSearchParam] = useState('name');
  // ! states of charts 

  const [chartModal, setChartModal] = useState(false)
  
  //! add element states

  const [add, setAdd] = useState(false)
  const [addData, setAddData] = useState("")

  // ! table handle 
  const handleTableChange = (newPagination) => {
    console.log("pagination", newPagination);
    
    fetchData(newPagination);
    setPagination(newPagination);
  };

  // ! work with fetching data

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
      name: `Item ${start + i + 1}`,
      age: 20+i,
      // address: `Address ${start + i + 1}`,
      id:i,
    }));
    console.log("new data: ", newData)
    setData(newData);
    setPagination({
      ...params,
      total: 10000000, // Общее количество элементов (10^7)
    });
    setLoading(false);
  };

  useEffect(() => {
      fetchData(pagination);
    }, []);

  // Параметры для выбора поля поиска
  const searchOptions = [
    { value: 'name', label: 'Имя' },
    { value: 'age', label: 'Возраст' },
    // { value: 'address', label: 'Адрес' },
  ];
  
  // Функция поиска
  const handleSearch = () => {
    const filteredData = data.filter(item =>
      String(item[searchParam]).toLowerCase().includes(searchText.toLowerCase())
    );
    setData(filteredData);
  };
  
  // Функция сброса поиска
  const handleReset = () => {
    setSearchText('');
    fetchData(pagination)
  };
  
  // Колонки таблицы
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
  function onAddStroke(data){
    console.log("onAddStroke")
    // TODO FETCH DATA to server 
  }
  return (
    <div style={{ padding: '20px' }}>
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
      <Flex justify="space-between" align='center'>

        <Button type="primary" onClick={()=>setChartModal(true)}>Нарисовать данные</Button>
        <Modal open={chartModal} onCancel={()=>setChartModal(false)} footer={null} >
          <Chart id={id}/>
        </Modal>
        
        { 
        add ? 
        <>
          <div>
          <Button onClick={()=>setAdd(false)}> Cancel</Button>
          <AddUsForm onAddStroke={onAddStroke}/>
          </div>
        </>
        :
        <Button type="primary" onClick={()=>{setAdd(true)}}>Добавить строку</Button>



        }
      </Flex>

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
        <Modal open={modal} onCancel={()=>setModal(false)} footer={null}>
          chart
          {/* <ShowStroke data={data} id={id} columns={columns} pageSize = {pagination.pageSize}/> */}
        </Modal>
      </Form>
    </div>
  );
};

export default ShowStroke;