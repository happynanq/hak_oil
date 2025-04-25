import React, { useEffect, useState } from 'react';
import { Table, Input, Space, Select, Form, Modal, Button, Flex, message  } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import InteractiveChart from './Charts/InteractiveChart';

const ShowStroke = ({ id }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchParam, setSearchParam] = useState('well_number');
  const [chartModal, setChartModal] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  // Исходные данные
  const initialData = [
    {
      "field": 1,
      "well_number": 42,
      "cluster_site_number": 50,
      "productive_horizon_layer": 12,
      "research_start_date": "2025-04-16T08:15:00.000Z",
      "research_end_date": "2025-04-16T10:45:00.000Z",
      "device_type": 3,
      "device_number": 15,
      "instrument_depth_tvd": 2345,
      "instrument_depth_tvdss": 2250,
      "perforation_top_md": 2350,
      "perforation_top_tvd": 2350,
      "perforation_top_tvdss": 2255,
      "depth_difference_instrument_perforation": 5,
      "oil_flow_correction_density": 0.85,
      "fluid_density_vdp_shutdown": 0.92,
      "fluid_density_vdp_operating": 0.88,
      "pressure_difference_depth_vdp_shutdown": 12.5,
      "pressure_difference_depth_vdp_operating": 10.2,
      "id": 1
    },
    {
      "field": 1,
      "well_number": 42,
      "cluster_site_number": 5,
      "productive_horizon_layer": 12,
      "research_start_date": "2025-04-17T09:30:00.000Z",
      "research_end_date": "2025-04-17T12:00:00.000Z",
      "device_type": 3,
      "device_number": 15,
      "instrument_depth_tvd": 2345,
      "instrument_depth_tvdss": 2250,
      "perforation_top_md": 2350,
      "perforation_top_tvd": 2350,
      "perforation_top_tvdss": 2255,
      "depth_difference_instrument_perforation": 5,
      "oil_flow_correction_density": 0.84,
      "fluid_density_vdp_shutdown": 0.91,
      "fluid_density_vdp_operating": 0.87,
      "pressure_difference_depth_vdp_shutdown": 13.1,
      "pressure_difference_depth_vdp_operating": 10.5,
      "id": 2
    },
    {
      "field": 1,
      "well_number": 42,
      "cluster_site_number": 5,
      "productive_horizon_layer": 12,
      "research_start_date": "2025-04-18T08:45:00.000Z",
      "research_end_date": "2025-04-18T11:15:00.000Z",
      "device_type": 3,
      "device_number": 15,
      "instrument_depth_tvd": 2345,
      "instrument_depth_tvdss": 2250,
      "perforation_top_md": 2350,
      "perforation_top_tvd": 2350,
      "perforation_top_tvdss": 2255,
      "depth_difference_instrument_perforation": 5,
      "oil_flow_correction_density": 0.83,
      "fluid_density_vdp_shutdown": 0.93,
      "fluid_density_vdp_operating": 0.86,
      "pressure_difference_depth_vdp_shutdown": 13.8,
      "pressure_difference_depth_vdp_operating": 11.0,
      "id": 3
    },
    {
      "field": 1,
      "well_number": 42,
      "cluster_site_number": 5,
      "productive_horizon_layer": 12,
      "research_start_date": "2025-04-19T09:00:00.000Z",
      "research_end_date": "2025-04-19T11:30:00.000Z",
      "device_type": 3,
      "device_number": 15,
      "instrument_depth_tvd": 2345,
      "instrument_depth_tvdss": 2250,
      "perforation_top_md": 2350,
      "perforation_top_tvd": 2350,
      "perforation_top_tvdss": 2255,
      "depth_difference_instrument_perforation": 5,
      "oil_flow_correction_density": 0.82,
      "fluid_density_vdp_shutdown": 0.94,
      "fluid_density_vdp_operating": 0.85,
      "pressure_difference_depth_vdp_shutdown": 14.2,
      "pressure_difference_depth_vdp_operating": 11.5,
      "id": 4
    },
    {
      "field": 1,
      "well_number": 42,
      "cluster_site_number": 5,
      "productive_horizon_layer": 12,
      "research_start_date": "2025-04-20T08:30:00.000Z",
      "research_end_date": "2025-04-20T11:00:00.000Z",
      "device_type": 3,
      "device_number": 15,
      "instrument_depth_tvd": 2345,
      "instrument_depth_tvdss": 2250,
      "perforation_top_md": 2350,
      "perforation_top_tvd": 2350,
      "perforation_top_tvdss": 2255,
      "depth_difference_instrument_perforation": 5,
      "oil_flow_correction_density": 0.81,
      "fluid_density_vdp_shutdown": 0.95,
      "fluid_density_vdp_operating": 0.84,
      "pressure_difference_depth_vdp_shutdown": 14.8,
      "pressure_difference_depth_vdp_operating": 12.0,
      "id": 5
    },
    {
      "field": 1,
      "well_number": 42,
      "cluster_site_number": 5,
      "productive_horizon_layer": 12,
      "research_start_date": "2025-04-21T09:15:00.000Z",
      "research_end_date": "2025-04-21T11:45:00.000Z",
      "device_type": 3,
      "device_number": 15,
      "instrument_depth_tvd": 2345,
      "instrument_depth_tvdss": 2250,
      "perforation_top_md": 2350,
      "perforation_top_tvd": 2350,
      "perforation_top_tvdss": 2255,
      "depth_difference_instrument_perforation": 5,
      "oil_flow_correction_density": 0.80,
      "fluid_density_vdp_shutdown": 0.96,
      "fluid_density_vdp_operating": 0.83,
      "pressure_difference_depth_vdp_shutdown": 15.3,
      "pressure_difference_depth_vdp_operating": 12.5,
      "id": 6
    },
    {
      "field": 1,
      "well_number": 42,
      "cluster_site_number": 5,
      "productive_horizon_layer": 12,
      "research_start_date": "2025-04-22T08:00:00.000Z",
      "research_end_date": "2025-04-22T10:30:00.000Z",
      "device_type": 3,
      "device_number": 15,
      "instrument_depth_tvd": 2345,
      "instrument_depth_tvdss": 2250,
      "perforation_top_md": 2350,
      "perforation_top_tvd": 2350,
      "perforation_top_tvdss": 2255,
      "depth_difference_instrument_perforation": 5,
      "oil_flow_correction_density": 0.79,
      "fluid_density_vdp_shutdown": 0.97,
      "fluid_density_vdp_operating": 0.82,
      "pressure_difference_depth_vdp_shutdown": 15.8,
      "pressure_difference_depth_vdp_operating": 13.0,
      "id": 7
    },
    {
      "field": 1,
      "well_number": 42,
      "cluster_site_number": 5,
      "productive_horizon_layer": 12,
      "research_start_date": "2025-04-23T09:30:00.000Z",
      "research_end_date": "2025-04-23T12:00:00.000Z",
      "device_type": 3,
      "device_number": 15,
      "instrument_depth_tvd": 2345,
      "instrument_depth_tvdss": 2250,
      "perforation_top_md": 2350,
      "perforation_top_tvd": 2350,
      "perforation_top_tvdss": 2255,
      "depth_difference_instrument_perforation": 5,
      "oil_flow_correction_density": 0.78,
      "fluid_density_vdp_shutdown": 0.98,
      "fluid_density_vdp_operating": 0.81,
      "pressure_difference_depth_vdp_shutdown": 16.2,
      "pressure_difference_depth_vdp_operating": 13.5,
      "id": 8
    }
  ];

  // Загрузка данных
  const fetchData = async (params) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { current, pageSize } = params;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    
    const paginatedData = initialData.slice(start, end);
    setData(paginatedData);
    setPagination({
      ...params,
      total: initialData.length,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchData(pagination);
    setData(initialData)
  }, []);

  // Параметры поиска
  const searchOptions = [
    { value: 'well_number', label: 'Номер скважины' },
    { value: 'cluster_site_number', label: 'Номер куста' },
    { value: 'productive_horizon_layer', label: 'Продуктивный горизонт' },
    { value: 'device_type', label: 'Тип устройства' },
  ];

  // Обработчики поиска
  const handleSearch = () => {
    const filteredData = initialData.filter(item =>
      String(item[searchParam]).toLowerCase().includes(searchText.toLowerCase())
    );
    setData(filteredData);
    setPagination({
      ...pagination,
      current: 1,
      total: filteredData.length,
    });
  };

  const handleReset = () => {
    setSearchText('');
    fetchData(pagination);
  };

  // Колонки таблицы
  const columns = [
    {
      title: 'Поле',
      dataIndex: 'field',
      key: 'field',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Номер скважины',
      dataIndex: 'well_number',
      key: 'well_number',
      width: 150,
    },
    {
      title: 'Номер куста',
      dataIndex: 'cluster_site_number',
      key: 'cluster_site_number',
      width: 150,
    },
    {
      title: 'Продуктивный горизонт',
      dataIndex: 'productive_horizon_layer',
      key: 'productive_horizon_layer',
      width: 200,
    },
    {
      title: 'Дата начала исследования',
      dataIndex: 'research_start_date',
      key: 'research_start_date',
      width: 200,
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Дата окончания исследования',
      dataIndex: 'research_end_date',
      key: 'research_end_date',
      width: 200,
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Тип устройства',
      dataIndex: 'device_type',
      key: 'device_type',
      width: 150,
    },
    {
      title: 'Номер устройства',
      dataIndex: 'device_number',
      key: 'device_number',
      width: 150,
    },
    {
      title: 'Глубина прибора TVD',
      dataIndex: 'instrument_depth_tvd',
      key: 'instrument_depth_tvd',
      width: 180,
    },
    {
      title: 'Глубина прибора TVDSS',
      dataIndex: 'instrument_depth_tvdss',
      key: 'instrument_depth_tvdss',
      width: 180,
    },
    {
      title: 'Верх перфорации MD',
      dataIndex: 'perforation_top_md',
      key: 'perforation_top_md',
      width: 180,
    },
    {
      title: 'Верх перфорации TVD',
      dataIndex: 'perforation_top_tvd',
      key: 'perforation_top_tvd',
      width: 180,
    },
    {
      title: 'Верх перфорации TVDSS',
      dataIndex: 'perforation_top_tvdss',
      key: 'perforation_top_tvdss',
      width: 180,
    },
    {
      title: 'Разница глубин прибор-перфорация',
      dataIndex: 'depth_difference_instrument_perforation',
      key: 'depth_difference_instrument_perforation',
      width: 250,
    },
    {
      title: 'Плотность нефтяного потока (коррекция)',
      dataIndex: 'oil_flow_correction_density',
      key: 'oil_flow_correction_density',
      width: 250,
    },
    {
      title: 'Плотность флюида ВДП (останов)',
      dataIndex: 'fluid_density_vdp_shutdown',
      key: 'fluid_density_vdp_shutdown',
      width: 220,
    },
    {
      title: 'Плотность флюида ВДП (работа)',
      dataIndex: 'fluid_density_vdp_operating',
      key: 'fluid_density_vdp_operating',
      width: 220,
    },
    {
      title: 'Перепад давления по глубине ВДП (останов)',
      dataIndex: 'pressure_difference_depth_vdp_shutdown',
      key: 'pressure_difference_depth_vdp_shutdown',
      width: 300,
    },
    {
      title: 'Перепад давления по глубине ВДП (работа)',
      dataIndex: 'pressure_difference_depth_vdp_operating',
      key: 'pressure_difference_depth_vdp_operating',
      width: 300,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'right',
    },
    {
      title: 'Действия',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  // Обработчики CRUD операций
  const handleAdd = () => {
    form.resetFields();
    setAddModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setCurrentRecord(record);
    setEditModalVisible(true);
  };

  const handleDelete = (id) => {
    setRecordToDelete(id);
    setDeleteConfirmVisible(true);
  };
  const confirmDelete = () => {
    const newData = data.filter(item => item.id !== recordToDelete);
    setData(newData);
    setPagination({
      ...pagination,
      total: newData.length,
    });
    message.success('Запись успешно удалена');
    setDeleteConfirmVisible(false);
    setRecordToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmVisible(false);
    setRecordToDelete(null);
  };


  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (currentRecord) {
        // Редактирование существующей записи
        const newData = data.map(item => 
          item.id === currentRecord.id ? { ...values, id: currentRecord.id } : item
        );
        setData(newData);
        setEditModalVisible(false);
      } else {
        // Добавление новой записи
        const newId = Math.max(...data.map(item => item.id), 0) + 1;
        const newData = [...data, { ...values, id: newId }];
        setData(newData);
        setAddModalVisible(false);
      }
      form.resetFields();
      setCurrentRecord(null);
    });
  };

  // Форма для добавления/редактирования
  const renderForm = () => {
    const formItems = [
      { name: 'field', label: 'Поле', rules: [{ required: true }] },
      { name: 'well_number', label: 'Номер скважины', rules: [{ required: true }] },
      { name: 'cluster_site_number', label: 'Номер куста', rules: [{ required: true }] },
      { name: 'productive_horizon_layer', label: 'Продуктивный горизонт', rules: [{ required: true }] },
      { name: 'research_start_date', label: 'Дата начала исследования', rules: [{ required: true }] },
      { name: 'research_end_date', label: 'Дата окончания исследования', rules: [{ required: true }] },
      { name: 'device_type', label: 'Тип устройства', rules: [{ required: true }] },
      { name: 'device_number', label: 'Номер устройства', rules: [{ required: true }] },
      { name: 'instrument_depth_tvd', label: 'Глубина прибора TVD', rules: [{ required: true }] },
      { name: 'instrument_depth_tvdss', label: 'Глубина прибора TVDSS', rules: [{ required: true }] },
      { name: 'perforation_top_md', label: 'Верх перфорации MD', rules: [{ required: true }] },
      { name: 'perforation_top_tvd', label: 'Верх перфорации TVD', rules: [{ required: true }] },
      { name: 'perforation_top_tvdss', label: 'Верх перфорации TVDSS', rules: [{ required: true }] },
      { name: 'depth_difference_instrument_perforation', label: 'Разница глубин прибор-перфорация', rules: [{ required: true }] },
      { name: 'oil_flow_correction_density', label: 'Плотность нефтяного потока (коррекция)', rules: [{ required: true }] },
      { name: 'fluid_density_vdp_shutdown', label: 'Плотность флюида ВДП (останов)', rules: [{ required: true }] },
      { name: 'fluid_density_vdp_operating', label: 'Плотность флюида ВДП (работа)', rules: [{ required: true }] },
      { name: 'pressure_difference_depth_vdp_shutdown', label: 'Перепад давления по глубине ВДП (останов)', rules: [{ required: true }] },
      { name: 'pressure_difference_depth_vdp_operating', label: 'Перепад давления по глубине ВДП (работа)', rules: [{ required: true }] },
    ];

    return (
      <Form form={form} layout="vertical">
        {formItems.map(item => (
          <Form.Item
            key={item.name}
            name={item.name}
            label={item.label}
            rules={item.rules}
          >
            <Input />
          </Form.Item>
        ))}
      </Form>
    );
  };
  const handleTableChange = (newPagination) => {
    fetchData(newPagination);
    setPagination(newPagination);
  };
  return (
    <div style={{ padding: '20px' }}>
      {/* Поиск и фильтрация */}
      <Space style={{ marginBottom: 16 }}>
        <Select
          style={{ width: 200 }}
          value={searchParam}
          onChange={value => setSearchParam(value)}
          options={searchOptions}
        />
        <Input
          placeholder={`Поиск по ${searchOptions.find(opt => opt.value === searchParam)?.label || searchParam}`}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 250 }}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Поиск
        </Button>
        <Button onClick={handleReset}>
          Сбросить
        </Button>
      </Space>
      
      {/* Кнопки действий */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setChartModal(true)}>
          Нарисовать данные
        </Button>
        <Button type="primary" onClick={handleAdd}>
          Добавить строку
        </Button>
      </Flex>

      {/* Таблица */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 'max-content', y: 500 }}
        style={{ margin: '20px 0' }}
        bordered
        size="middle"
      />

      <Modal
        title="Удалить запись?"
        open={deleteConfirmVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Да"
        cancelText="Нет"
      >
        <p>Вы уверены, что хотите удалить эту запись?</p>
      </Modal>

      {/* Модальное окно для графика */}
      <Modal 
        open={chartModal} 
        onCancel={() => setChartModal(false)} 
        footer={null}
        width="90%"
        style={{ top: 20 }}
      >
        <InteractiveChart id={id} data = {data} />
      </Modal>

      {/* Модальное окно для редактирования */}
      <Modal
        title="Редактировать запись"
        open={editModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentRecord(null);
        }}
        width={800}
      >
        {renderForm()}
      </Modal>

      {/* Модальное окно для добавления */}
      <Modal
        title="Добавить новую запись"
        open={addModalVisible}
        onOk={handleSubmit}
        onCancel={() => setAddModalVisible(false)}
        width={800}
      >
        {renderForm()}
      </Modal>
    </div>
  );
};

export default ShowStroke;