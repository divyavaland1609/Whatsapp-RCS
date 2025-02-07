/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Badge,
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  CalendarOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  LoadingOutlined,
  MessageOutlined,
  PhoneOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import { useDispatch, useSelector } from "react-redux";
import { setRichCardNodeData } from "../redux/reducer.button";
import TextEditor from "../nodes/Texteditor";
import PhoneInput from "react-phone-input-2";
const { Option } = Select;

function RichcardNodeSidebar({ selectedNode }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes.find((item) => item.id === selectedNode);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(alldata?.data?.mediaUrl ?? "");
  const [value, setValue] = useState(alldata?.data?.size ?? "medium");
  const [editingCardId, setEditingCardId] = useState(null);

  const [templateName, setTemplateName] = useState(
    alldata?.data?.templateName ?? "Rich Card"
  );
  const [messagename, setMessageName] = useState(alldata?.data?.label ?? "");

  const [description, setDescription] = useState(
    alldata?.data?.description ?? ""
  );
  const [data, setData] = useState({
    actions: alldata?.data?.actions ?? [
      {
        id: 0,
        type: "quick",
        title: "Default button",
        // title: "",
        payload: "",
      },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const toggleEditMode = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  const handleTemplateNameChange = (e) => {
    const value = e.target.value;
    setTemplateName(value);
    const data = { selectedNode, value, key: "templateName" };
    dispatch(setRichCardNodeData(data));
  };

  const handleMessageNameChange = (e) => {
    const value = e.target.value;
    setMessageName(value);
    const data = { selectedNode, value, key: "label" };
    dispatch(setRichCardNodeData(data));
  };
  const handleDescriptionNameChange = (value) => {
    const description = value;
    setDescription(description);
    const data = { selectedNode, value, key: "description" };
    dispatch(setRichCardNodeData(data));
  };

  useEffect(() => {
    if (alldata) {
      setTemplateName(alldata?.data?.templateName ?? "Rich Card");
      setMessageName(alldata?.data?.label ?? "");
      setDescription(alldata?.data?.description ?? "");
      setImageUrl(alldata?.data?.mediaUrl ?? "");
    }
  }, [selectedNode]);

  useEffect(() => {
    if (alldata) {
      const actions = alldata?.data?.actions ?? [
        {
          id: 0,
          type: "quick",
          title: "Default Button",
          payload: "",
        },
      ];

      setData({
        actions: actions,
      });

      const initValues = actions?.reduce((acc, button, i) => {
        console.log("button", button);
        acc[`button-type-${i}`] = button.type;
        acc[`button-title-${i}`] = button.title;
        acc[`button-payload-${i}`] = button.payload;
        acc[`button-phoneNumber-${i}`] = button.phoneNumber;
        acc[`button-url-${i}`] = button.url;
        acc[`button-label-${i}`] = button.label;
        acc[`button-button-copy-code-${i}`] = button.copy;

        return acc;
      }, {});
      form.resetFields();
      form.setFieldsValue(initValues);
      // form.setFieldsValue(initValues);
    }
  }, [selectedNode]);

  const onChange = (value) => {
    setValue(value);
    const data = { selectedNode, value, key: "size" };
    dispatch(setRichCardNodeData(data));
  };

  const handleChange = (index, key, val) => {
    setData((prev) => {
      const actions = [...prev.actions];
      actions[index] = { ...actions[index], [key]: val };
      const { actions: value } = { ...prev, actions };
      const data = { selectedNode, value, key: "actions" };
      dispatch(setRichCardNodeData(data));
      return { ...prev, actions };
    });
  };

  const quickReplyCount = data.actions.filter(
    (btn) => btn.type === "quick"
  ).length;
  const quickReplyCount1 = data.actions.filter(
    (btn) => btn.type === "call"
  ).length;
  const quickReplyCount2 = data.actions.filter(
    (btn) => btn.type === "url"
  ).length;
  const quickReplyCount3 = data.actions.filter(
    (btn) => btn.type === "copy-code"
  ).length;

  const addNewCard = () => {
    if (data.actions.length < 3) {
      setData((prev) => {
        const value = {
          ...prev,
          actions: [
            ...prev.actions,
            {
              id: prev.actions.length,
              type: "quick",
              title: "",
              payload: "",
            },
          ],
        };
        const initValues = alldata?.data?.actions?.reduce((acc, button, i) => {
          console.log("button", button);
          acc[`button-type-${i}`] = button.type;
          acc[`button-title-${i}`] = button.title;
          acc[`button-payload-${i}`] = button.payload;
          acc[`button-phoneNumber-${i}`] = button.phoneNumber;
          acc[`button-url-${i}`] = button.url;
          acc[`button-label-${i}`] = button.label;
          acc[`button-button-copy-code-${i}`] = button.copy;

          return acc;
        }, {});
        form.resetFields();
        form.setFieldsValue(initValues);
        const data = { selectedNode, value: value.actions, key: "actions" };
        dispatch(setRichCardNodeData(data));
        return value;
      });
    } else {
      message.warning("Cannot add more than 3 buttons");
    }
  };
  const deleteCard = (index) => {
    if (data.actions.length > 1) {
      setData((prev) => {
        const value = [...prev.actions]
          .filter((_, i) => i !== index)
          .map((item, i) => ({ ...item, id: i }));
        const data = { selectedNode, value, key: "actions" };
        const initValues = data?.actions?.reduce((acc, button, i) => {
          console.log("button", button);
          acc[`button-type-${i}`] = button.type;
          acc[`button-title-${i}`] = button.title;
          acc[`button-payload-${i}`] = button.payload;
          acc[`button-phoneNumber-${i}`] = button.phoneNumber;
          acc[`button-url-${i}`] = button.url;
          acc[`button-label-${i}`] = button.label;
          acc[`button-button-copy-code-${i}`] = button.copy;

          return acc;
        }, {});
        form.resetFields();
        form.setFieldsValue(initValues);
        dispatch(setRichCardNodeData(data));
        return { ...prev, actions: value };
      });
    } else {
      message.warning("Buttons must be greater than 1");
    }
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

  const props = {
    name: "file",
    multiple: false,
    accept: ".png,.jpg,.jpeg,.mp4,.pdf",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        setImageUrl(info.file);
        const mediaUrl =
          info.file.response?.url ||
          URL.createObjectURL(info.file.originFileObj);
        const mediaType = info.file.type;

        const data = {
          selectedNode,
          value: { url: mediaUrl, type: mediaType },
          key: "mediaUrl",
        };
        dispatch(setRichCardNodeData(data));

        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const customUpload = ({ file, onSuccess, onError }) => {
    try {
      const fileType = file.type;
      if (
        !["image/png", "image/jpeg", "video/mp4", "application/pdf"].includes(
          fileType
        )
      ) {
        onError("Unsupported file format");
        return;
      }

      // Simulate the upload process
      setTimeout(() => {
        const fileUrl = URL.createObjectURL(file);
        onSuccess({ url: fileUrl });
      }, 1000);
    } catch (error) {
      onError(error);
    }
  };

  const handleEditToggle = (id) => {
    setEditingCardId(editingCardId === id ? null : id);
  };

  const handleDelete = () => {
    setImageUrl(null);

    dispatch(
      setRichCardNodeData({
        selectedNode: selectedNode,
        key: "mediaUrl",
        value: null,
      })
    );
  };

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
        <Form layout="vertical" form={form}>
          <Row align="middle" justify="center">
            <Col md={14}>
              <Form.Item>
                <Input
                  size="small"
                  ref={(input) => (inputRef.current = input?.input || null)}
                  placeholder="Enter Template Name"
                  maxLength={25}
                  value={templateName}
                  onChange={handleTemplateNameChange}
                  readOnly={!isEditing}
                />
              </Form.Item>
            </Col>
            <Col
              md={2}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                cursor: "pointer",
              }}
              onClick={toggleEditMode}
            >
              <EditOutlined />
            </Col>
            <Col md={8} style={{ paddingRight: "8px" }}>
              <Badge.Ribbon text="Rich Card" className="badge">
                <div style={{ width: "100%" }}></div>{" "}
              </Badge.Ribbon>
            </Col>
          </Row>

          <Row
            align="bottom"
            justify="space-between"
            style={{ marginBottom: "5px" }}
          >
            <Col>
              <label> Media</label>
            </Col>
            <Col>
              <Select
                size="small"
                value={value}
                style={{ width: 120 }}
                onChange={onChange}
                options={[
                  { value: "short", label: "Short" },
                  { value: "medium", label: "Medium" },
                  { value: "tall", label: "Tall" },
                ]}
              />
            </Col>
          </Row>

          <Row align="middle" justify="space-evenly">
            <Col md={24} style={{ position: "relative" }}>
              <Dragger
                {...props}
                showUploadList={false}
                customRequest={customUpload}
                style={{ padding: 10 }}
              >
                {imageUrl
                  ? 
                  (() => {
                      const mediaUrl = imageUrl.response?.url || imageUrl;
                      const fileType = imageUrl.type;

                      if (fileType?.includes("image")) {
                        return (
                          <img
                            src={mediaUrl}
                            alt="avatar"
                            style={{ width: "100%", height: 90 }}
                          />
                        );
                      }
                      if (fileType === "video/mp4") {
                        return (
                          <video
                            src={mediaUrl}
                            controls
                            style={{ width: "100%", height: 90 }}
                          />
                        );
                      }
                      if (fileType === "application/pdf") {
                        return (
                          <div>
                            <iframe
                              src={mediaUrl}
                              title="PDF Preview"
                              style={{
                                width: "100%",
                                height: 90,
                                border: "none",
                              }}
                            />
                            {/* <a
                              href={mediaUrl}
                              download="Document.pdf"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "block",
                                marginTop: 5,
                                textDecoration: "underline",
                                color: "#1890ff",
                              }}
                            >
                              Download PDF
                            </a> */}
                          </div>
                        );
                      }
                      return null;
                    })()
                  : uploadButton}
              </Dragger>
              {imageUrl && (
                <DeleteOutlined
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    color: "red",
                    cursor: "pointer",
                  }}
                  onClick={handleDelete} // Delete handler
                />
              )}
            </Col>
            {/* <Col md={24}>
              <Dragger {...props} 
              showUploadList={false}
              customRequest={customUpload}>
                {imageUrl ? (
                  <img
                    src={imageUrl?.response?.url || imageUrl}
                    alt="avatar"
                    style={{
                      // objectFit: "scale-down",
                      width: "100%",
                      height: 50,
                    }}
                  />
                ) : (
                  uploadButton
                )}
              </Dragger>
              <DeleteOutlined
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      color: "red",
                    }}
                  />
            </Col> */}
          </Row>
          <Form.Item label="Title" style={{ marginBottom: "10px" }}>
            <Input
              placeholder="Title"
              id="message"
              value={messagename}
              onChange={handleMessageNameChange}
            />
          </Form.Item>
          <Form.Item label="Description" style={{ marginBottom: "10px" }}>
            <TextEditor
              value={alldata?.data?.description || "description"}
              onChange={(value) => handleDescriptionNameChange(value)}
            />
          </Form.Item>
          <Flex justify="space-between">
            <Typography.Text>Buttons</Typography.Text>
            {/* <Form.Item label="" /> */}
            <Button size="small" onClick={addNewCard}>
              <PlusOutlined /> Add
            </Button>
          </Flex>

          <div style={{ paddingTop: "5px" }}>
            {data.actions.map((action, index) => (
              <Card
                style={{ marginTop: 4 }}
                title=""
                styles={{ body: { padding: "5px" } }}
                key={action.id}
              >
                {editingCardId === action.id && (
                  <DeleteOutlined
                    onClick={() => deleteCard(index)}
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      color: "red",
                    }}
                  />
                )}
                {editingCardId !== action.id ? (
                  <Row align="middle" justify="space-between">
                    <Col>
                      <Button
                        size="small"
                        shape="round"
                        icon={
                          <>
                            {action?.type === "quick" && <MessageOutlined />}
                            {action?.type === "call" && <PhoneOutlined />}
                            {action?.type === "url" && <LinkOutlined />}
                            {action?.type === "copy-code" && <CopyOutlined />}
                          </>
                        }
                      >
                        {action.title || ""}
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        onClick={() => handleEditToggle(action.id)}
                        icon={<EditOutlined />}
                        type="text"
                      />
                      <Button
                        icon={
                          <DeleteOutlined
                            onClick={() => deleteCard(index)}
                            style={{ color: "red" }}
                          />
                        }
                        type="text"
                      />
                    </Col>
                  </Row>
                ) : (
                  <Form
                    layout="vertical"
                    // initialValues={{
                    //   type: action.type,
                    //   title: action.title,
                    // }}
                    form={form}
                  >
                    <Row align="middle" justify="space-between">
                      <Col>
                        <Button
                          size="small"
                          shape="round"
                          icon={
                            <>
                              {action?.type === "quick" && <MessageOutlined />}
                              {action?.type === "call" && <PhoneOutlined />}
                              {action?.type === "url" && <LinkOutlined />}
                              {action?.type === "copy-code" && <CopyOutlined />}
                            </>
                          }
                        >
                          {action.title || ""}
                        </Button>
                      </Col>
                    </Row>
                    <Row align="middle" gutter={[5, 0]}>
                      <Col md={12}>
                        <Form.Item
                          name={`button-type-${index}`}
                          label="Action"
                          rules={[
                            {
                              required: true,
                              message: "Please select an action!",
                            },
                          ]}
                        >
                          <Select
                            defaultValue="quick"
                            size="small"
                            value={action.type}
                            onChange={(value) =>
                              handleChange(index, "type", value)
                            }
                            style={{ width: "100%", textAlign: "left" }}
                            options={[
                              {
                                value: "quick",
                                label: "Quick Reply",
                                disabled: quickReplyCount >= 3,
                              },
                              {
                                value: "call",
                                label: "Call Button",
                                disabled: quickReplyCount1 >= 1,
                              },
                              {
                                value: "url",
                                label: "URL Button",
                                disabled: quickReplyCount2 >= 1,
                              },
                              {
                                value: "copy-code",
                                label: "Copy Code",
                                disabled: quickReplyCount3 >= 1,
                              },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col md={12}>
                        <Form.Item
                          name={`button-title-${index}`}
                          rules={[
                            {
                              required: true,
                              type: "string",
                              message: "Please enter title",
                            },
                            {
                              max: 25,
                              message: "Title must be within 25 characters",
                            },
                          ]}
                          label="Title"
                          // initialValue={action.title}
                        >
                          <Input
                            size="small"
                            style={{ fontSize: "15px" }}
                            value={action.title}
                            onChange={(e) =>
                              handleChange(index, "title", e.target.value)
                            }
                            placeholder="Enter Title"
                            maxLength={25}
                          />
                        </Form.Item>
                      </Col>
                      {action.type === "call" && (
                        <Col md={24}>
                          <Form.Item
                            name={`button-phoneNumber-${index}`}
                            label="Phone Number"
                            rules={[
                              {
                                required: true,
                                type: "string",
                                message: "Please enter Phone Number",
                              },
                            ]}
                            initialValue={action.phoneNumber}
                          >
                            <PhoneInput
                              country={"in"}
                              isValid={(value, country) => {
                                if (value.match(/12345/)) {
                                  return "Invalid value";
                                } else if (value.match(/1234/)) {
                                  return false;
                                } else {
                                  return true;
                                }
                              }}
                              inputStyle={{
                                width: "100%",
                                background: " #ffffff",
                                borderWidth: "1px",
                                borderStyle: "solid",
                                borderColor: "#d9d9d9",
                                borderRadius: "6px",
                                height: "24px",
                              }}
                              value={action.phoneNumber}
                              onChange={(phone) =>
                                handleChange(index, "phoneNumber", phone)
                              }
                              name=""
                              placeholder="Enter Phone Number"
                              inputProps={{
                                size: "large",
                                maxLength: 15,
                              }}
                            />
                            {/* <Input
                              value={action.phoneNumber}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "phoneNumber",
                                  e.target.value
                                )
                              }
                              placeholder="Enter Phone Number"
                            /> */}
                          </Form.Item>
                        </Col>
                      )}
                      {action.type === "url" && (
                        <Col md={24}>
                          <Form.Item
                            name={`button-url-${index}`}
                            label="URL"
                            initialValue={action.payload}
                            rules={[
                              {
                                required: true,
                                message: "URL is required",
                              },
                              {
                                type: "url",
                                message: "Enter a valid URL",
                              },
                            ]}
                          >
                            <Input
                              size="small"
                              // addonBefore={
                              //   <Select defaultValue="http://">
                              //     <Option value="http://">http://</Option>
                              //     <Option value="https://">https://</Option>
                              //   </Select>
                              // }
                              value={action.payload}
                              onChange={(e) =>
                                handleChange(index, "payload", e.target.value)
                              }
                              placeholder="Enter URL"
                            />
                          </Form.Item>
                        </Col>
                      )}
                      {/* {action.type === "copy-code" && (
                        <Col md={24}>
                          <Form.Item
                            name={`button-copy-code-${index}`}
                            // label="URL"
                            initialValue={action.payload}
                            rules={[
                              {
                                required: true,
                                message: "Copy Code is required",
                              },
                              {
                                type: "copy-code",
                                message: "Enter a valid Copy Code",
                              },
                            ]}
                          ></Form.Item>
                        </Col>
                      )} */}
                    </Row>
                  </Form>
                )}
              </Card>
            ))}
          </div>
        </Form>
      </ConfigProvider>
    </>
  );
}

export default RichcardNodeSidebar;
