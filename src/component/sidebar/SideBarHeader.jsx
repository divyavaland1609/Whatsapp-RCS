/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Affix,
  Button,
  Card,
  ConfigProvider,
  Flex,
  Row,
  Typography,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import React from "react";

function SideBarHeader({ setSelectedNode, title }) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            textHoverBg: "#ffffff",
            colorBgTextActive: "#ffffff",
            textTextActiveColor: "rgb(47,84,235)",
          },
        },
      }}
    >
      <Affix offsetTop={1}>
        <Card
          styles={{body:{padding: "5px"}}}
          style={{ width: "100%" }}
          bordered={false}
        >
          <Row>
            <Flex align="center" gap={20}>
              <Button
                type="text"
                icon={<LeftOutlined onClick={() => setSelectedNode(null)} />}
              />

              <Typography.Title level={5} style={{ margin: "0px" }}>
                {title}
              </Typography.Title>
            </Flex>
          </Row>
        </Card>
      </Affix>
    </ConfigProvider>
  );
}
export default SideBarHeader;
