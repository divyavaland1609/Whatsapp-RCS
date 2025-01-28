import React from "react";
import { Card, Col, Row, Tooltip, Typography } from "antd";
import {
  BarChartOutlined,
  FileImageOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDnD } from "./DnDContext";

function Sidebar({ collapsed }) {
  const [_, setType] = useDnD();
  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const cards = [
    {
      id: 1,
      name: "Text",
      type: "Text",
      twoToneColor: "#878D98",
      bgColor: "#878D98",
      icons: (
        <FileTextOutlined
          style={{ fontSize: "20px", backgroundColor: "#878D98 !important" }}
        />
      ),
    },
    {
      id: 2,
      name: "Text With Button",
      type: "button",
      bgColor: "#F53F5F",
      icons: <PlusOutlined style={{ fontSize: "20px" }} />,
    },
    {
      id: 3,
      name: "Richcard",
      type: "richcard",
      bgColor: "#F2AF41",
      icons: <BarChartOutlined style={{ fontSize: "20px" }} />,
    },
    {
      id: 4,
      name: "Richcard Carousel",
      type: "richcard_carosal",
      bgColor: "#FF6F40",
      icons: <BarChartOutlined style={{ fontSize: "20px" }} />,
    },
    {
      id: 5,
      name: "Media",
      type: "media",
      bgColor: "#38C792",
      icons: <FileImageOutlined style={{ fontSize: "20px" }} />,
    },
  ];

  return (
    <Row gutter={[10, 10]}>
      {cards.map((card) => (
        <Col key={card.id} span={24}>
          <div
            draggable
            onDragStart={(event) => onDragStart(event, card.type)}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Card
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.2s",
                marginBottom: "10px",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
              }}
              styles={{
                body: {
                  backgroundColor: card.bgColor,
                  padding: "10px",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  justifyContent: "center",
                  textAlign: "center",
                },
              }}
              hoverable
            >
              {collapsed ? (
                <Tooltip placement="left" title={card.name}>
                  <Row justify="center">{card.icons}</Row>
                </Tooltip>
              ) : (
                <>
                  <Row
                    align={"middle"}
                    justify={"start"}
                    style={{ backgroundColor: card.bgColor }}
                  >
                    <div style={{ backgroundColor: card.bgColor }}>
                      {card.icons}
                    </div>
                    <Typography.Text
                      style={{
                        paddingLeft: "10px",
                        backgroundColor: card.bgColor,
                      }}
                    >
                      {card.name}
                    </Typography.Text>
                  </Row>
                </>
              )}
            </Card>
          </div>
        </Col>
      ))}
    </Row>
  );
}
export default Sidebar;
