import { Upload, Button, Form, message, List, Typography } from 'antd';
import { UploadOutlined, DeleteOutlined, FileOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Text } = Typography;

const AddElement = () => {
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  // Проверка типа файла
  const isValidFileType = (file) => {
    const validTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return validTypes.includes(file.type);
  };

  const beforeUpload = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    // if (!isLt5M) {
    //   message.error(`${file.name} слишком большой (максимум 5MB)`);
    //   return Upload.LIST_IGNORE;
    // }
    // if (!isValidFileType(file)) {
    //   message.error(`${file.name} имеет недопустимый формат`);
    //   return Upload.LIST_IGNORE;
    // }
    return true;
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList.slice(0, 4)); // Ограничение до 4 файлов
  };

  const onSubmit = async () => {
    if (fileList.length === 0) {
      message.warning('Пожалуйста, загрузите файлы');
      return;
    }

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files', file.originFileObj);
    });

    try {
      // Имитация запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success(`${fileList.length} файлов успешно загружены`);
      setFileList([]);
    } catch (error) {
      message.error('Ошибка при загрузке');
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <Form form={form}>
        <Form.Item label="Документы" required>
          <Upload
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            multiple
            maxCount={4}
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} style={{ marginBottom: 16 }}>
              Добавить файлы (макс. 4)
            </Button>
          </Upload>

          <List
            dataSource={fileList}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      setFileList(fileList.filter(f => f.uid !== item.uid));
                    }}
                  />
                ]}
              >
                <List.Item.Meta
                  avatar={<FileOutlined />}
                  title={<Text ellipsis>{item.name}</Text>}
                  description={`${(item.size / 1024).toFixed(2)} KB`}
                />
              </List.Item>
            )}
          />
        </Form.Item>

        <Button
          type="primary"
          onClick={onSubmit}
          disabled={fileList.length === 0}
          loading={false} // Можно добавить состояние загрузки
        >
          Отправить документы
        </Button>
      </Form>
    </div>
  );
};

export default AddElement;