import { Button, Flex, Layout, Image, Table, Modal, Space } from "antd";
import logo from "../assets/logoti_rosneft.png";
import EditableTable from "./EditableTable";
import { useState } from "react";
import AddElement from "./AddElement/AddElement";

export function TestLayout() {
  const [modal, setModal] = useState(false)
  return (
    <>
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header style={{ color: "white" }}>
        <Flex justify="space-between" align="center">
          <div>
            <Image
              src={logo}
              alt="Логотип"
              preview={false}
              width={120}
              height="auto"
            />
          </div>
          <Flex gap="middle">
            <Button type="primary" onClick={()=>{setModal(true)}}>Добавить исследование</Button>
            
          </Flex>
        </Flex>
      </Layout.Header>
      <Layout.Content
        style={{
          padding: "24px",
          display: "flex",
          justifyContent: "center", // Центрирует контейнер по горизонтали
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "800px", // Ограничиваем ширину контейнера
          }}
        >
          {/* <Table
            columns={columns}
            dataSource={data}
            bordered
            // style={{ width: "100%" }} // Таблица растягивается на весь контейнер
          /> */}
          <EditableTable/>
        </div>
      </Layout.Content>
      <Layout.Footer>Роснефть ©2025</Layout.Footer>
    </Layout>
    <Modal 
     
     open={modal} onCancel={()=>setModal(false)} footer={null}>
              <AddElement/>
      </Modal>
    </>
  );
}
