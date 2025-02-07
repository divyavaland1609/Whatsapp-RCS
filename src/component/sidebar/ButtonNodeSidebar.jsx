/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { act, useEffect, useRef, useState } from "react";
import {
  Input,
  Button,
  Row,
  Card,
  Flex,
  ConfigProvider,
  Form,
  Col,
  Select,
  InputNumber,
  DatePicker,
  message,
  Badge,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  MessageOutlined,
  PhoneOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateNodeData } from "../redux/reducer.button";
import TextEditor from "../nodes/Texteditor";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const { Option } = Select;
const ButtonNodeSidebar = ({ selectedNode }) => {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes?.find((item) => item.id === selectedNode);
  const [form] = Form.useForm();
  const [templateName, setTemplateName] = useState(
    alldata?.data?.templateName ?? "Text with Button"
  );
  const [footerTitle, setFooterTitle] = useState(
    alldata?.data?.footerTitle ?? ""
  );
  const [editingCardId, setEditingCardId] = useState(null);
  const [message1, setMessage] = useState(alldata?.data?.label ?? "");
  const [data, setData] = useState({
    actions: alldata?.data?.actions ?? [
      {
        id: 0,
        type: "quick",
        title: "Default button",
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

  useEffect(() => {
    if (alldata) {
      setTemplateName(alldata?.data?.templateName ?? "Text with Button");
      setMessage(alldata?.data?.label ?? "");
      // setImageUrl(alldata?.data?.mediaUrl ?? "");
    }
  }, [selectedNode, templateName]);

  const handleTemplateNameChange = (e) => {
    const value = e.target.value;
    setTemplateName(value);
    const data = { selectedNode, value, key: "templateName" };
    dispatch(setUpdateNodeData(data));
  };

  const handleFooterTitleChange = (e) => {
    const value = e.target.value;
    setFooterTitle(value);
    const data = { selectedNode, value, key: "footerTitle" };
    dispatch(setUpdateNodeData(data));
  };

  const handleMessageNameChange = (value) => {
    const MessageName = value;
    setMessage(MessageName);
    const data = { selectedNode, value, key: "label" };
    dispatch(setUpdateNodeData(data));
  };

  const selectBefore = (
    <Select defaultValue="http://">
      <Option value="http://">http://</Option>
      <Option value="https://">https://</Option>
    </Select>
  );

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
      setMessage(alldata?.data?.label);

      const initValues = actions?.reduce((acc, button, i) => {
        console.log("button", button);
        acc[`button-type-${i}`] = button.type;
        acc[`button-title-${i}`] = button.title;
        acc[`button-payload-${i}`] = button.payload;
        acc[`button-phoneNumber-${i}`] = button.phoneNumber;
        acc[`button-url-${i}`] = button.url;
        acc[`button-label-${i}`] = button.label;
        acc[`button-copy-${i}`] = button.copy;
        acc[`button-button-copy-code-${i}`] = button.copy;

        // acc[`button-label-${i}`] = button.label;
        // acc[`button-latitude-${i}`] = button.latitude;
        // acc[`button-longitude-${i}`] = button.longitude;
        // acc[`button-startDate-${i}`] = button.startDate;
        // acc[`button-endDate-${i}`] = button.endDate;
        // acc[`button-description-${i}`] = button.description;
        return acc;
      }, {});
      form.resetFields();
      form.setFieldsValue(initValues);
      // form.setFieldsValue(initValues);
    }
  }, [selectedNode]); // Add nodes here so it triggers when the data in nodes changes

  const handleChange = (index, key, val) => {
    console.log("phone number--->", val);

    setData((prev) => {
      const actions = [...prev.actions];
      actions[index] = { ...actions[index], [key]: val };
      const { actions: value } = { ...prev, actions };
      const data = { selectedNode, value, key: "actions" };
      dispatch(setUpdateNodeData(data));
      return { ...prev, actions };
    });
  };
  // const addNewCard = () => {
  //   if (data.actions.length < 10) {
  //     setData((prev) => {
  //       const value = {
  //         ...prev,
  //         actions: [
  //           ...prev.actions,
  //           {
  //             id: prev.actions.length,
  //             type: "quick",
  //             title: "",
  //             payload: "",
  //           },
  //         ],
  //       };
  //       const data = { selectedNode, value: value.actions, key: "actions" };
  //       dispatch(setUpdateNodeData(data));
  //       return value;
  //     });
  //   } else {
  //     message.warning("Cannot add more than 11 buttons");
  //   }
  // };

  const updateFormFields = (actions) => {
    const initValues = actions.reduce((acc, button, i) => {
      acc[`button-type-${i}`] = button.type;
      acc[`button-title-${i}`] = button.title;
      acc[`button-payload-${i}`] = button.payload;
      acc[`button-phoneNumber-${i}`] = button.phoneNumber;
      acc[`button-url-${i}`] = button.url;
      acc[`button-label-${i}`] = button.label;
      acc[`button-button-copy-code-${i}`] = button.copy;
      acc[`button-copy-code-${i}`] = button.copy;

      return acc;
    }, {});
    form.resetFields();
    form.setFieldsValue(initValues);
  };

  const addNewCard = () => {
    if (data.actions.length < 7) {
      setData((prev) => {
        const newActions = [
          ...prev.actions,
          {
            id: prev.actions.length,
            type: "quick",
            title: "",
            payload: "",
          },
        ];
        updateFormFields(newActions);
        dispatch(
          setUpdateNodeData({ selectedNode, value: newActions, key: "actions" })
        );
        return { ...prev, actions: newActions };
      });
    } else {
      message.warning("Cannot add more than 7 buttons");
    }
  };

  const deleteCard = (index) => {
    if (data.actions.length > 1) {
      setData((prev) => {
        const newActions = prev.actions.filter((_, i) => i !== index);
        updateFormFields(newActions);
        dispatch(
          setUpdateNodeData({ selectedNode, value: newActions, key: "actions" })
        );
        return { ...prev, actions: newActions };
      });
    } else {
      message.warning("Buttons must be greater than 1");
    }
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

  // const addNewCard = () => {
  //   if (data.actions.length < 11) {
  //     setData((prev) => {
  //       const value = {
  //         ...prev,
  //         actions: [
  //           ...prev.actions,
  //           {
  //             id: prev.actions.length,
  //             type: "quick",
  //             title: "",
  //             payload: "",
  //           },
  //         ],
  //       };
  //       const initValues = alldata?.data?.actions?.reduce((acc, button, i) => {
  //         console.log("button", button);
  //         acc[`button-type-${i}`] = button.type;
  //         acc[`button-title-${i}`] = button.title;
  //         acc[`button-payload-${i}`] = button.payload;
  //         acc[`button-phoneNumber-${i}`] = button.phoneNumber;
  //         acc[`button-url-${i}`] = button.url;
  //         acc[`button-label-${i}`] = button.label;

  //         acc[`button-button-copy-code-${i}`] = button.copy;

  //         // acc[`button-label-${i}`] = button.label;
  //         // acc[`button-latitude-${i}`] = button.latitude;
  //         // acc[`button-longitude-${i}`] = button.longitude;
  //         // acc[`button-startDate-${i}`] = button.startDate;
  //         // acc[`button-endDate-${i}`] = button.endDate;
  //         // acc[`button-description-${i}`] = button.description;
  //         return acc;
  //       }, {});
  //       form.resetFields();
  //       form.setFieldsValue(initValues);
  //       const data = { selectedNode, value: value.actions, key: "actions" };
  //       dispatch(setUpdateNodeData(data));
  //       return value;
  //     });
  //   } else {
  //     message.warning("Cannot add more than 11 buttons");
  //   }
  // };

  // const deleteCard = (index) => {
  //   if (data.actions.length > 1) {
  //     setData((prev) => {
  //       const value = [...prev.actions]
  //         .filter((_, i) => i !== index)
  //         .map((item, i) => ({ ...item, id: i }));
  //       const data = { selectedNode, value, key: "actions" };
  //       dispatch(setUpdateNodeData(data));
  //       return { ...prev, actions: value };
  //     });
  //   } else {
  //     message.warning("Buttons must be greater than 1");
  //   }
  // };

  // const deleteCard = (index) => {
  //   if (data.actions.length > 1) {
  //     setData((prev) => {
  //       const value = [...prev.actions]
  //         .filter((_, i) => i !== index)
  //         .map((item, i) => ({ ...item, id: i }));

  //       const initValues = alldata?.data?.actions?.reduce((acc, button, i) => {
  //         console.log("button", button);
  //         acc[`button-type-${i}`] = button.type;
  //         acc[`button-title-${i}`] = button.title;
  //         acc[`button-payload-${i}`] = button.payload;
  //         acc[`button-phoneNumber-${i}`] = button.phoneNumber;
  //         acc[`button-url-${i}`] = button.url;
  //         acc[`button-label-${i}`] = button.label;

  //         acc[`button-button-copy-code-${i}`] = button.copy;
  //         // acc[`button-latitude-${i}`] = button.latitude;
  //         // acc[`button-longitude-${i}`] = button.longitude;
  //         // acc[`button-startDate-${i}`] = button.startDate;
  //         // acc[`button-endDate-${i}`] = button.endDate;
  //         // acc[`button-description-${i}`] = button.description;
  //         return acc;
  //       }, {});
  //       form.resetFields();
  //       form.setFieldsValue(initValues);
  //       const data = { selectedNode, value, key: "actions" };
  //       dispatch(setUpdateNodeData(data));
  //       return { ...prev, actions: value };
  //     });
  //   } else {
  //     message.warning("Buttons must be greater than 1");
  //   }
  // };

  const handleEditToggle = (id) => {
    setEditingCardId(editingCardId === id ? null : id);
  };

  return (
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
        <Row align="middle" justify="center" gutter={[3, 12]}>
          <Col md={11}>
            <Form.Item>
              <Input
                size="small"
                maxLength={25}
                ref={(input) => (inputRef.current = input?.input || null)}
                placeholder="Enter Template Name"
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
          <Col md={11} style={{ paddingRight: "8px" }}>
            <Badge.Ribbon text="Text with Button" className="badge">
              <div style={{ width: "100%" }}></div>{" "}
            </Badge.Ribbon>
          </Col>
        </Row>

        <Form.Item label="Message">
          <TextEditor
            className="ql-editor"
            // style={{padding:"0px"}}
            value={message1}
            // value={alldata?.data?.label}
            onChange={(value) => handleMessageNameChange(value)}
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

        <Flex justify="space-between" align="center">
          <Typography.Text>Buttons</Typography.Text>
          {/* <Form.Item label="Buttons" /> */}
          <Button size="small" onClick={addNewCard}>
            <PlusOutlined /> Add
          </Button>
        </Flex>

        <div style={{ paddingTop: "5px" }}>
          {data?.actions?.map((action, index) => (
            <Card
              style={{ marginTop: 4 }}
              styles={{ body: { padding: "5px", paddingBottom: "5px" } }}
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
                      {action.title}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      onClick={() => handleEditToggle(action.id)}
                      icon={<EditOutlined />}
                      type="text"
                    />
                    <Button
                      style={{ color: "red" }}
                      icon={
                        <DeleteOutlined onClick={() => deleteCard(index)} />
                      }
                      type="text"
                    />
                  </Col>
                </Row>
              ) : (
                <Form
                  form={form}
                  layout="vertical"
                  // initialValues={{
                  //   type: action.type,
                  //   title: action.title,
                  // }}
                >
                  <Row align="middle" justify="space-between">
                    <Col>
                      <Button
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
                          size="small"
                          defaultValue="quick"
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
                              disabled: quickReplyCount2 >= 3,
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
                          disabled={action?.type === "copy-code"}
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
                            placeholder="Enter Phone Number"
                            inputProps={{
                              size: "large",
                              maxLength: 15,
                            }}
                          />
                        </Form.Item>
                      </Col>
                    )}
                    {action.type === "copy-code" && (
                      <Col md={24}>
                        {/* <Form.Item
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
                        ></Form.Item> */}
                        <Form.Item
                          name={`button-copy-${index}`}
                          label="Coupon Copy Code"
                          rules={[
                            {
                              required: true,
                              message: "Please enter a copy code",
                            },
                          ]}
                        >
                          <Input
                            size="small"
                            style={{ fontSize: "15px" }}
                            value={action.copy}
                            onChange={(e) =>
                              handleChange(index, "copy", e.target.value)
                            }
                            placeholder="Enter Coupon Code to Copy"
                            maxLength={15}
                          />
                        </Form.Item>
                      </Col>
                    )}
                    {action.type === "copy-code" && <></>}
                  </Row>
                </Form>
              )}
            </Card>
          ))}
        </div>
      </Form>
    </ConfigProvider>
  );
};
export default ButtonNodeSidebar;
