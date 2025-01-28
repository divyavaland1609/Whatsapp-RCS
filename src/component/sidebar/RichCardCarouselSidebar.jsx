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
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import {
  CalendarOutlined,
  CloseOutlined,
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
import React, { useEffect, useMemo, useRef, useState } from "react";
import CustomSegment from "./CustomSegment";
import { useDispatch, useSelector } from "react-redux";
import {
  setRichCardNodeCarousleData,
  setUpdateNodeData,
} from "../redux/reducer.button";
import TextEditor from "../nodes/Texteditor";
import PhoneInput from "react-phone-input-2";
const { Option } = Select;

function RichCardCarouselSidebar({ selectedNode }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = useMemo(
    () => nodes?.find((element) => element?.id === selectedNode),
    [selectedNode, nodes]
  );
  const [cardIndex, setCardIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(
    alldata?.data?.richCardCarousels?.cards ?? [
      {
        size: "medium",
        templateName: "",
        title: "Card 1",
        description: "",
        media: "",
      },
      {
        size: "medium",
        templateName: "",
        title: "Card 2",
        description: "",
        media: "",
      },
    ]
  );

  const [richCardCarousels, setRichCardCarousels] = useState({
    cards: alldata?.data?.richCardCarousels?.cards ?? [
      {
        size: "medium",
        templateName: "Rich Card Carousels",
        title: "Card Title",
        description: "Card Description",
        media: "",
        actions: alldata?.data?.richCardCarousels?.cards[0]?.actions ?? [
          {
            id: 0,
            type: "quick",
            title: "Default Button",
            payload: "",
          },
        ],
      },
      {
        size: "medium",
        templateName: "Rich Card Carousels",
        title: "Card Title",
        description: "Card Description",
        media: "",
        actions: alldata?.data?.richCardCarousels?.cards[1]?.actions ?? [
          {
            id: 0,
            type: "quick",
            title: "Default Button",
            payload: "",
          },
        ],
      },
    ],
  });

  const [previewImage, setPreviewImage] = useState([]);
  const [value, setValue] = useState(alldata?.data?.value ?? "medium");
  const [templateName, setTemplateName] = useState(
    alldata?.data?.templateName || "Rich Card Carousle"
  );
  const [cardWidth, setCardWidth] = useState(alldata?.data?.cardWidth ?? 0);

  const [isEditing, setIsEditing] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);

  const inputRef = useRef(null);
  const toggleEditMode = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  useEffect(() => {}, []);

  useEffect(() => {
    if (alldata) {
      setTemplateName(alldata?.data?.templateName ?? "Rich Card Carousle");
      const defaultCards = alldata?.data?.richCardCarousels?.cards ?? [
        {
          size: "medium",
          templateName: "Rich Card Carousels",
          title: "Card  Title",
          description: "Card Description",
          media: "",
          actions: [
            {
              id: 0,
              type: "quick",
              title: "Default Button",
              payload: "",
            },
          ],
        },
        {
          size: "medium",
          templateName: "Rich Card Carousels",
          title: "Card  Title",
          description: "Card Description",
          media: "",
          actions: [
            {
              id: 0,
              type: "quick",
              title: "Default Button",
              payload: "",
            },
          ],
        },
      ];

      setRichCardCarousels({
        cards: defaultCards,
      });

      const defaultOptions = defaultCards?.map(
        (card, index) => `Card ${index + 1}`
      );
      setOptions(defaultOptions);
      setCardIndex(0);
      const initValues = defaultCards?.reduce((acc, card, index) => {
        acc[`title${index}`] = card.title;
        acc[`description${index}`] = card.description;
        acc[`media${index}`] = card.media;
        acc[`size${index}`] = card.size;
        card.actions.forEach((button, i) => {
          acc[`button-type-${index}-${i}`] = button.type;
          acc[`button-title-${index}-${i}`] = button.title;
          acc[`button-payload-${index}-${i}`] = button.payload;
          acc[`button-phoneNumber-${index}-${i}`] = button.phoneNumber;
          acc[`button-url-${index}-${i}`] = button.url;
          acc[`button-label-${index}-${i}`] = button.label;
          acc[`button-button-copy-code-${i}`] = button.copy;
        });

        return acc;
      }, {});

      form.resetFields();
      form.setFieldsValue(initValues);
    }
  }, [selectedNode]);

  const customUpload = ({ file, onSuccess, onError }) => {
    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      // Simulating the upload process (replace with real upload logic)
      setTimeout(() => {
        onSuccess({ url: img.src }); // On success, return the image URL
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      onError(error);
    }
  };

  const props = {
    name: "file",
    multiple: false,
    onChange(info, index, key) {
      const { status } = info.file;
      if (info.file.status === "uploading") {
        setLoading(true);
        return;
      }
      if (info.file.status === "done") {
        setLoading(false);
        const newImageUrl = URL.createObjectURL(info.file.originFileObj);

        setRichCardCarousels((prev) => {
          const updatedCards = prev.cards.map((card, i) =>
            i === cardIndex ? { ...card, media: newImageUrl } : card
          );

          console.log("Updated Cards:", updatedCards); // Debug here

          const value = { ...prev, cards: updatedCards };
          const data = { selectedNode, value, key: "richCardCarousels" };

          dispatch(setUpdateNodeData(data));

          return { ...prev, cards: updatedCards };
        });
      }
    },
  };

  const handleTemplateNameChange = (e) => {
    const value = e.target.value;
    setTemplateName(value);
    const data = { selectedNode, value, key: "templateName" };
    dispatch(setUpdateNodeData(data));
  };

  const handleMessageNameChange = (e, index, key) => {
    const newMessageName = e.target.value;
    setRichCardCarousels((prev) => {
      const updatedCards = prev.cards.map((card, i) =>
        i === index ? { ...card, [key]: newMessageName } : card
      );

      const value = { cards: updatedCards };
      const data = { selectedNode, value, key: "richCardCarousels" };

      dispatch(setUpdateNodeData(data));

      return { cards: updatedCards };
    });
  };

  const onChange = (value, index, key) => {
    const newSize = value;
    setValue(newSize);

    setRichCardCarousels((prev) => {
      const updatedCards = prev.cards.map((card, i) =>
        i === index ? { ...card, [key]: newSize } : card
      );

      const value = { ...prev, cards: updatedCards };
      const data = { selectedNode, value, key: "richCardCarousels" };

      dispatch(setUpdateNodeData(data));

      return { ...prev, cards: updatedCards };
    });
  };

  const handleDescriptionNameChange = (value, index, key) => {
    const newDescriptionName = value;
    setRichCardCarousels((prev) => {
      const updatedCards = prev.cards.map((card, i) =>
        i === index ? { ...card, [key]: newDescriptionName } : card
      );

      const value = { ...prev, cards: updatedCards };
      const data = { selectedNode, value, key: "richCardCarousels" };

      dispatch(setUpdateNodeData(data));

      return { ...prev, cards: updatedCards };
    });
  };

  // const handleImageUpload = (info, index, key) => {
  //   if (info.file.status === "uploading") {
  //     setLoading(true);
  //     return;
  //   }
  //   if (info.file.status === "done") {
  //     const newImageUrl = URL.createObjectURL(info.file.originFileObj);
  //     setLoading(false);
  //     setRichCardCarousels((prev) => {
  //       const updatedCards = prev.cards.map((card, i) =>
  //         i === index ? { ...card, [key]: newImageUrl } : card
  //       );

  //       const value = { ...prev, cards: updatedCards };
  //       const data = { selectedNode, value, key: "richCardCarousels" };

  //       dispatch(setUpdateNodeData(data));

  //       return { ...prev, cards: updatedCards };
  //     });
  //   }
  // };

  const uploadButton = (
    <Button
      style={{
        border: 0,
        background: "none",
      }}
      icon={loading ? <LoadingOutlined /> : <PlusOutlined />}
    >
      Upload
    </Button>
  );

  const selectBefore = (
    <Select defaultValue="http://">
      <Option value="http://">http://</Option>
      <Option value="https://">https://</Option>
    </Select>
  );

  const handleAddCardsTemplate = () => {
    if (options.length < 10) {
      const newCard = {
        size: value,
        templateName: "",
        title: `Card  Title`,
        description: `Card  description`,
        media: "",
        actions: [
          {
            id: 0,
            type: "quick",
            title: "Default Button",
            payload: "",
          },
        ],
      };
      setOptions((prev) => [...prev, `Card ${prev.length + 1}`]);
      setRichCardCarousels((prev) => {
        const updatedCards = [...(prev.cards || []), newCard];
        const data = {
          selectedNode,
          value: { ...prev, cards: updatedCards },
          key: "richCardCarousels",
        };
        dispatch(setRichCardNodeCarousleData(data));
        return { ...prev, cards: updatedCards };
      });
    } else {
      message.warning("Cannot add more than 10 cards");
    }
  };

  const addNewCard = () => {
    setRichCardCarousels((prev) => {
      const updatedCards = prev.cards.map((card, index) => {
        if (index === cardIndex) {
          if (card.actions.length < 4) {
            const updatedActions = [
              ...card.actions,
              {
                id: card.actions.length,
                type: "quick",
                title: "Default Button",
                payload: "",
              },
            ];
            return { ...card, actions: updatedActions };
          } else {
            message.warning("Cannot add more than 4 buttons to a card");
            return card;
          }
        }
        return card;
      });
      setCardIndex(0);
      const initialValues = richCardCarousels?.cards[
        cardIndex
      ]?.actions?.reduce((acc, button, i) => {
        acc[`button-type-${cardIndex}-${i}`] = button.type ?? "";
        acc[`button-title-${cardIndex}-${i}`] = button.title ?? "";
        acc[`button-payload-${cardIndex}-${i}`] = button.payload ?? "";
        acc[`button-phoneNumber-${cardIndex}-${i}`] = button.phoneNumber ?? "";
        acc[`button-url-${cardIndex}-${i}`] = button.url ?? "";
        acc[`button-label-${cardIndex}-${i}`] = button.label ?? "";
        acc[`button-button-copy-code-${i}`] = button.copy;
        return acc;
      }, {});
      form.resetFields();
      form.setFieldsValue(initialValues);

      const data = {
        selectedNode,
        value: { ...prev, cards: updatedCards },
        key: "richCardCarousels",
      };
      dispatch(setUpdateNodeData(data));

      return { ...prev, cards: updatedCards };
    });
  };

  const deleteCard = (index) => {
    if (richCardCarousels?.cards[cardIndex]?.actions?.length > 1) {
      const updatedRichCardCarousels = {
        ...richCardCarousels,
        cards: richCardCarousels.cards.map((card, i) => {
          if (i === cardIndex) {
            return {
              ...card,
              actions: card.actions
                .filter((_, i) => i !== index)
                .map((item, i) => ({ ...item, id: i })),
            };
          }
          return card;
        }),
      };
      setCardIndex(0);
      const initialValues = richCardCarousels?.cards[
        cardIndex
      ]?.actions?.reduce((acc, button, i) => {
        acc[`button-type-${cardIndex}-${i}`] = button.type;
        acc[`button-title-${cardIndex}-${i}`] = button.title;
        acc[`button-payload-${cardIndex}-${i}`] = button.payload;
        acc[`button-phoneNumber-${cardIndex}-${i}`] = button.phoneNumber;
        acc[`button-url-${cardIndex}-${i}`] = button.url;
        acc[`button-label-${cardIndex}-${i}`] = button.label;
        acc[`button-button-copy-code-${i}`] = button.copy;
        return acc;
      }, {});
      form.resetFields();
      form.setFieldsValue(initialValues);
      const data = {
        selectedNode,
        value: updatedRichCardCarousels,
        key: "richCardCarousels",
      };
      dispatch(setUpdateNodeData(data));
      setRichCardCarousels(updatedRichCardCarousels);
    } else {
      message.warning("Buttons must be greater than 1");
    }
  };

  const handleChange = (index, type, value) => {
    setRichCardCarousels((prev) => {
      const updatedCards = prev.cards.map((card, i) => {
        if (i === cardIndex) {
          return {
            ...card,
            actions: card.actions.map((action, j) =>
              j === index ? { ...action, [type]: value } : action
            ),
          };
        }
        return card;
      });
      const updatedData = { ...prev, cards: updatedCards };
      const data = {
        selectedNode,
        value: updatedData,
        key: "richCardCarousels",
      };
      dispatch(setUpdateNodeData(data));
      return updatedData;
    });
  };

  const handleEditToggle = (id) => {
    setEditingCardId(editingCardId === id ? null : id);
  };

  const handleCardChange = (newValue) => {
    setCardIndex(newValue);
  };

  const handlecardwidth = (e) => {
    const value = e.target.value;
    setCardWidth(value);
    const data = { selectedNode, value, key: "cardWidth" };
    dispatch(setRichCardNodeCarousleData(data));
  };

  const handleDeleteImage = (index) => {
    setRichCardCarousels((prev) => {
      const updatedCards = prev.cards.map((card, i) =>
        i === index ? { ...card, media: "" } : card
      );

      const value = { ...prev, cards: updatedCards };
      const data = { selectedNode, value, key: "richCardCarousels" };

      dispatch(setUpdateNodeData(data)); // Update Redux store
      return { ...prev, cards: updatedCards };
    });
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
          <Row align="middle" justify="center" gutter={[0, 16]}>
            <Col md={9}>
              <Form.Item>
                <Input
                  size="small"
                  ref={(input) => (inputRef.current = input?.input || null)}
                  name="templateName"
                  maxLength={25}
                  placeholder="Template Name"
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
            <Col md={13} style={{ paddingRight: "8px" }}>
              <Badge.Ribbon text="Rich Card Carousel" className="badge">
                <div style={{ width: "100%" }}></div>{" "}
              </Badge.Ribbon>
            </Col>
          </Row>
          <Form.Item
            name={"rich_card_carousel_width"}
            label="Width"
            rules={[{ required: true, message: "Width is required" }]}
          >
            <Radio.Group
              defaultValue={cardWidth}
              size="small"
              style={{ display: "flex", gap: 20 }}
              onChange={(e) => handlecardwidth(e)}
            >
              <div
                style={{
                  border: "1px solid #D9D9D9",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  width: "100%",
                }}
              >
                <Row align="middle" justify={"space-around"}>
                  <Col>
                    <Radio value={0}>Small</Radio>
                  </Col>
                  <Col>
                    <Radio value={1}>Medium</Radio>
                  </Col>
                </Row>
              </div>
            </Radio.Group>
          </Form.Item>
          <Row>
            <Col md={24}>
              <Flex
                align="center"
                justify="space-between"
                style={{ marginTop: 10, marginBottom: 10 }}
              >
                <Typography
                  style={{
                    alignSelf: "center",
                    fontSize: 16,
                  }}
                >
                  Cards
                </Typography>
                <Button size="small" onClick={handleAddCardsTemplate}>
                  <PlusOutlined /> Add
                </Button>
              </Flex>
            </Col>
          </Row>
          <Row>
            <Col md={24}>
              <Col>
                <CustomSegment
                  selectedNode={selectedNode}
                  onChange={handleCardChange}
                  options={options}
                  value={cardIndex}
                  setOptions={setOptions}
                  setRichCardCarousels={setRichCardCarousels}
                  setPreviewImage={setPreviewImage}
                  previewImage={previewImage}
                  richCardCarousels={richCardCarousels}
                />
              </Col>
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
                onChange={(value) => onChange(value, cardIndex, "size")}
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
                {alldata?.data?.richCardCarousels?.cards[cardIndex]?.media ? (
                  <>
                    {/* <div
                    style={{ position: "relative" }}
                   > */}
                    <img
                      src={
                        alldata?.data?.richCardCarousels?.cards[cardIndex]
                          ?.media
                      }
                      alt="avatar"
                      style={{
                        width: "100%",
                        // objectFit: "scale-down",
                        height: 90,
                      }}
                    />
                    {/* Delete icon */}
                    {/* <DeleteOutlined
                      style={{
                        position: "absolute",
                        top: -7,
                        right: -64,
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDeleteImage(cardIndex)} // Pass the cardIndex to the delete handler
                    /> */}
                    {/* </div> */}
                  </>
                ) : (
                  uploadButton
                )}
              </Dragger>
              {alldata?.data?.richCardCarousels?.cards[cardIndex]?.media && (
                <DeleteOutlined
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    color: "red",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDeleteImage(cardIndex)} // Pass the cardIndex to the delete handler
                />
              )}
            </Col>
          </Row>
          <Form.Item
            name={`title${cardIndex}`}
            label="Title"
            style={{ marginBottom: "10px" }}
            initialValue={
              alldata?.data?.richCardCarousels?.cards[cardIndex]?.title ??
              richCardCarousels?.cards[cardIndex]?.title
            }
          >
            <Input
              placeholder="Title"
              value={richCardCarousels?.cards[cardIndex]?.title}
              id="message"
              onChange={(e) => handleMessageNameChange(e, cardIndex, "title")}
            />
          </Form.Item>
          <Form.Item
            name={`description${cardIndex}`}
            label="Description"
            style={{ marginBottom: "10px" }}
            initialValue={
              alldata?.data?.richCardCarousels?.cards[cardIndex]?.description ??
              richCardCarousels?.cards[cardIndex]?.description
            }
          >
            <TextEditor
              value={richCardCarousels?.cards[cardIndex]?.description}
              onChange={(value) =>
                handleDescriptionNameChange(value, cardIndex, "description")
              }
            />
          </Form.Item>

          <Flex justify="space-between">
            <Typography.Text>Buttons</Typography.Text>
            {/* <Form.Item label="" /> */}
            <Button
              size="small"
              onClick={() =>
                addNewCard(richCardCarousels?.cards[cardIndex]?.actions?.length)
              }
            >
              <PlusOutlined /> Add
            </Button>
          </Flex>
          {richCardCarousels?.cards[cardIndex]?.actions.map((btn, index) => (
            <Card
              style={{ marginTop: 4 }}
              title=""
              styles={{ body: { padding: "5px" } }}
              key={btn.id}
            >
              {editingCardId === btn.id && (
                <CloseOutlined
                  onClick={() => setEditingCardId(null)}
                  style={{ position: "absolute", top: 6, right: 6 }}
                />
              )}

              {editingCardId !== btn.id ? (
                <Row align="middle" justify="space-between">
                  <Col>
                    <Button
                      shape="round"
                      icon={
                        <>
                          {btn?.type === "quick" && <MessageOutlined />}
                          {btn?.type === "call" && <PhoneOutlined />}
                          {btn?.type === "url" && <LinkOutlined />}
                          {btn?.type === "copy-code" && <CopyOutlined />}
                        </>
                      }
                    >
                      {" "}
                      {btn.title || ""}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      onClick={() => handleEditToggle(btn.id)}
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
                    {/* <Button
                      icon={<CloseOutlined onClick={() => deleteCard(index)} />}
                      type="text"
                    /> */}
                  </Col>
                </Row>
              ) : (
                <Form
                  layout="vertical"
                  // initialValues={{
                  //   type: btn.type,
                  //   title: btn.title,
                  // }}
                  form={form}
                >
                  <Row align="middle" justify="space-between">
                    <Col>
                      <Button
                        shape="round"
                        icon={
                          <>
                            {btn?.type === "quick" && <MessageOutlined />}
                            {btn?.type === "call" && <PhoneOutlined />}
                            {btn?.type === "url" && <LinkOutlined />}
                            {btn?.type === "copy-code" && <CopyOutlined />}
                          </>
                        }
                      >
                        {" "}
                        {btn.title || ""}
                      </Button>
                    </Col>
                  </Row>
                  <Row align="middle" gutter={[5, 0]}>
                    <Col md={12}>
                      <Form.Item
                        name={`button-type-${cardIndex}-${index}`}
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
                          value={btn.type}
                          onChange={(value) =>
                            handleChange(index, "type", value)
                          }
                          style={{ width: "100%", textAlign: "left" }}
                          options={[
                            { value: "quick", label: "Quick Reply" },
                            { value: "call", label: "Call Button" },
                            { value: "url", label: "URL Button" },
                            { value: "copy-code", label: "Copy Code" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item
                        name={`button-title-${cardIndex}-${index}`}
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
                        // initialValue={btn.title}
                      >
                        <Input
                          size="small"
                          style={{ fontSize: "15px" }}
                          value={btn.title}
                          onChange={(e) =>
                            handleChange(index, "title", e.target.value)
                          }
                          placeholder="Enter Title"
                          maxLength={25}
                        />
                      </Form.Item>
                    </Col>
                    {btn.type === "call" && (
                      <Col md={24}>
                        <Form.Item
                          name={`button-phoneNumber-${cardIndex}-${index}`}
                          label="Phone Number"
                          rules={[
                            {
                              required: true,
                              type: "string",
                              message: "Please enter Phone Number",
                            },
                          ]}
                          initialValue={btn.phoneNumber}
                        >
                          <PhoneInput
                            size="small"
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
                            value={btn.phoneNumber}
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
                        </Form.Item>
                      </Col>
                    )}
                    {btn.type === "url" && (
                      <Col md={24}>
                        <Form.Item
                          name={`button-url-${cardIndex}-${index}`}
                          label="URL"
                          initialValue={btn.payload}
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
                            // addonBefore={selectBefore}
                            value={btn.payload}
                            onChange={(e) =>
                              handleChange(index, "payload", e.target.value)
                            }
                            placeholder="Enter URL"
                          />
                        </Form.Item>
                      </Col>
                    )}
                    {btn.type === "copy-code" && (
                      <Col md={24}>
                        <Form.Item
                          name={`button-copy-code-${index}`}
                          // label="URL"
                          initialValue={btn.payload}
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
                    )}
                  </Row>
                </Form>
              )}
            </Card>
          ))}
        </Form>
      </ConfigProvider>
    </>
  );
}
export default RichCardCarouselSidebar;
