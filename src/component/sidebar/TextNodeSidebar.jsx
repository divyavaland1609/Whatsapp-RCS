/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { Badge, Col, ConfigProvider, Form, Input, Layout, Row } from "antd";
import { EditOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateNodeData } from "../redux/reducer.button";
import TextEditor from "../nodes/Texteditor";
const TextNodeSidebar = ({ setSelectedNode, title, selectedNode }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes.find((item) => item.id === selectedNode);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(alldata?.data?.mediaUrl ?? "");
  const [message1, setMessage] = useState(alldata?.data?.label ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [footerTitle, setFooterTitle] = useState(
    alldata?.data?.footerTitle ?? ""
  );
  console.log(alldata, "data");

  const inputRef = useRef(null);
  const toggleEditMode = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  const [templateName, setTemplateName] = useState(
    alldata?.data?.templateName ?? "Send Message"
  );
  useEffect(() => {
    const alldata = nodes.find((item) => item.id === selectedNode);
    if (alldata) {
      setTemplateName(alldata?.data?.templateName ?? "Send Message");
      setMessage(alldata?.data?.label ?? "");
      setImageUrl(alldata?.data?.mediaUrl ?? "");
    }
  }, [selectedNode, nodes, templateName]);

  const handleTemplateNameChange = (e) => {
    const value = e.target.value;
    setTemplateName(value);
    const data = { selectedNode, value, key: "templateName" };
    dispatch(setUpdateNodeData(data));
  };

  const handleMessageNameChange = (value) => {
    const MessageName = value;
    setMessage(MessageName);
    const data = { selectedNode, value, key: "label" };
    dispatch(setUpdateNodeData(data));
  };

  const handleFooterTitleChange = (e) => {
    const value = e.target.value;
    setFooterTitle(value);
    const data = { selectedNode, value, key: "footerTitle" };
    dispatch(setUpdateNodeData(data));
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Form: {
              verticalLabelPadding: "0 0 3px",
              itemMarginBottom: 5,
            },
          },
        }}
      >
        <Form form={form} layout="vertical">
          <Row align="middle" gutter={[3, 12]}>
            <Col md={10} align="left">
              <Form.Item>
                <Input
                  size="small"
                  ref={(input) => (inputRef.current = input?.input || null)}
                  onChange={handleTemplateNameChange}
                  value={templateName}
                  readOnly={!isEditing}
                  maxLength={25}
                />
              </Form.Item>
            </Col>
            <Col
              md={4}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={toggleEditMode}
            >
              <EditOutlined />
            </Col>
            <Col md={10} style={{ paddingRight: "8px" }}>
              <Badge.Ribbon text="Send Message" className="badge">
                <div style={{ width: "100%" }}></div>{" "}
              </Badge.Ribbon>
            </Col>
          </Row>
          <Form.Item label="Message">
            <TextEditor
              value={message1}
              onChange={(value) => {
                setMessage(value);
                handleMessageNameChange(value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="footer Title"
            label="Footer Title"
            value={footerTitle}
            // initialValue={btn.payload}
            rules={[
              {
                required: true,
                message: "Footer Title is required",
              },
            ]}
          >
            <Input
              size="small"
              required={true}
              // addonBefore={selectBefore}
              // value={btn.payload}
              onChange={handleFooterTitleChange}
              placeholder="Enter Footer Title"
            />
          </Form.Item>
        </Form>
      </ConfigProvider>
    </>
  );
};
export default TextNodeSidebar;
