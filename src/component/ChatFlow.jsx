import { ProChat } from "@ant-design/pro-chat";
import {
  Avatar,
  Badge,
  Button,
  Col,
  Divider,
  Drawer,
  Flex,
  Input,
  Row,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  MessageOutlined,
  PaperClipOutlined,
  PhoneOutlined,
  SendOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const ChatFlow = ({ styles, nodeData, edges }) => {
  console.log("nodeData", nodeData);
  const [chats, setChats] = useState([]);
  const [open, setOpen] = useState(false);

  const [currentNodeId, setCurrentNodeId] = useState(null);
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (nodeData && Array.isArray(nodeData)) {
      const transformedChats = nodeData
        .map((node, index) => {
          if (node.data && node.data.id) {
            return {
              id: `${node.data.id}`,
              content: node.data.label || "",
              type: node.type,
              role: "assistant",
              ...node.data,
            };
          }
          return null;
        })
        .filter(Boolean);
      console.log("transformedChats", transformedChats);
      setChats(transformedChats.filter((item) => item?.isStartNode === true));
      if (transformedChats.length > 0) {
        setCurrentNodeId(transformedChats[0].id);
      }
    }
  }, [nodeData]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);
  const getNextNode = (currentNodeId, type, handle) => {
    console.log("next", currentNodeId, type, handle);
    var nextEdge = [];
    if (
      type === "richcard_carosal" ||
      type === "richcard" ||
      type === "button"
    ) {
      nextEdge = edges.filter(
        (edge) => edge.sourceHandle === handle && edge.source === currentNodeId
      );
    }

    console.log("nextEdge", nextEdge);
    const targetIds = nextEdge.map((edge) => edge.target);
    if (targetIds.length > 0) {
      const nextNode = nodeData.filter((node) =>
        targetIds.includes(node.data.id)
      );
      return nextNode;
    }
    return null;
  };

  const handleButtonClick = (buttonTitle, currentNodeId, type, handle) => {
    setChats((prevChats) => [
      ...prevChats,
      {
        id: `button-${Date.now()}`,
        content: `${buttonTitle}`,
        type: "Text",
        role: "user",
      },
    ]);
    const nextNode = getNextNode(currentNodeId, type, handle);
    console.log("nextNode", nextNode);
    if (nextNode) {
      setCurrentNodeId(nextNode?.[0]?.data?.id);

      setChats((prevChats) => [
        ...prevChats,
        ...nextNode.map((node, index) => {
          console.log("nodeid", node.data.id);
          if (prevChats.some((chat) => chat.id === node.data.id)) {
            return {
              ...node.data,
              id: `${Date.now()}-${node?.data?.id}`,
              content: node?.data?.label || "",
              type: node.type,
              role: "assistant",
            };
          } else {
            return {
              ...node.data,
              id: `${node?.data?.id}`,
              content: node?.data?.label || "",
              type: node.type,
              role: "assistant",
            };
          }
        }),
      ]);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // console.log("chats", chats);

  const renderChatContent = (item) => {
    switch (item?.originData?.type) {
      case "button":
        return (
          <div className="chat-message button-message">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: 10,
              }}
              dangerouslySetInnerHTML={{
                __html:
                  item?.originData?.label
                    ?.replace(/<p>/g, "<span>")
                    ?.replace(/<\/p>/g, "</span>") || "message",
              }}
            />
            {item?.originData?.actions ? (
              <>
                {Array.isArray(item?.originData?.actions) &&
                  item.originData.actions.map((btn, i) => (
                    <React.Fragment key={`action-${i}`}>
                      <Button
                        // className="btn"
                        size="small"
                        block
                        type="text"
                        // color="primary"
                        onClick={() =>
                          handleButtonClick(
                            btn.title,
                            item?.originData?.id,
                            item?.originData?.type,
                            `handle-${i}`
                          )
                        }
                      >
                        {btn.type === "quick" && (
                          <Typography.Text>
                            <MessageOutlined /> {btn?.title}
                          </Typography.Text>
                        )}
                        {btn.type === "call" && (
                          <Typography.Text>
                            <PhoneOutlined /> {btn?.title}
                          </Typography.Text>
                        )}
                        {btn.type === "url" && (
                          <Typography.Text>
                            <LinkOutlined /> {btn?.title}
                          </Typography.Text>
                        )}
                        {btn.type === "location" && (
                          <Typography.Text>
                            <EnvironmentOutlined /> {btn?.title}
                          </Typography.Text>
                        )}
                        {btn.type === "calendar" && (
                          <Typography.Text>
                            <CalendarOutlined /> {btn?.title}
                          </Typography.Text>
                        )}
                      </Button>
                      {i < item.originData.actions.length - 1 && (
                        <Divider style={{ margin: "0px" }} />
                      )}
                    </React.Fragment>
                  ))}
              </>
            ) : (
              <Button
                size="small"
                block
                type="text"
                onClick={() =>
                  alert(`Button clicked: ${item?.originData?.content}`)
                }
              >
                <MessageOutlined />
                Default Button
              </Button>
            )}
          </div>
        );
      case "media":
        return (
          <div className="chat-message media-message">
            {console.log("2222-->", item?.originData?.mediaArray)}
            {item?.originData?.mediaArray.map((media, index) => (
              <div key={`media-${index}`}>
                <img
                  src={media.url}
                  alt="custom content"
                  className="chat-image"
                />
              </div>
            ))}
          </div>
        );
      case "richcard":
        return (
          <div className="chat-message card-message">
            <img
              src={
                item?.originData?.mediaUrl ||
                "https://medcities.org/wp-content/uploads/2021/05/generic_image_medcities-1.jpg"
              }
              alt="custom content"
              className="chat-image"
            />

            <Typography.Text className="title">
              <small
                dangerouslySetInnerHTML={{
                  __html:
                    item?.originData?.content?.replace(/\n/g, "<br/>") ||
                    "message",
                }}
              />
            </Typography.Text>
            {/* <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: 5,
                  padding:"0"
                }}
                className="message-text"
               
              /> */}

            <Typography.Text
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: 5,
                padding: "0",
              }}
            >
              <small
                dangerouslySetInnerHTML={{
                  __html:
                    item?.originData?.description
                      ?.trim()
                      ?.replace(/<p>/g, "<span>")
                      ?.replace(/<\/p>/g, "</span>") || "message",
                }}
              />
            </Typography.Text>
            {item?.originData?.actions ? (
              <>
                {Array.isArray(item?.originData?.actions) &&
                  item.originData.actions.map((btn, i) => (
                    <>
                      <Button
                        key={`button-${i}`}
                        // className="btn"
                        size="small"
                        block
                        type="text"
                        onClick={() =>
                          handleButtonClick(
                            btn.title,
                            item?.originData?.id,
                            item?.originData?.type,
                            `handle-${i}`
                          )
                        }
                      >
                        {btn.type === "quick" && (
                          <Typography.Text>
                            <MessageOutlined /> {btn?.title}
                          </Typography.Text>
                        )}
                        {btn.type === "call" && (
                          <Typography.Text>
                            <PhoneOutlined /> {btn?.title}
                          </Typography.Text>
                        )}
                        {btn.type === "url" && (
                          <Typography.Text>
                            <LinkOutlined /> {btn?.title}
                          </Typography.Text>
                        )}
                        {btn.type === "location" && (
                          <Typography.Text>
                            <EnvironmentOutlined /> {btn?.title}
                          </Typography.Text>
                        )}
                        {btn.type === "calendar" && (
                          <Typography.Text>
                            <CalendarOutlined /> {btn?.title}
                          </Typography.Text>
                        )}
                      </Button>
                      {i < item.originData.actions.length - 1 && (
                        <Divider style={{ margin: "0px" }} />
                      )}
                    </>
                  ))}
              </>
            ) : (
              <Button
                // className="btn"
                size="small"
                block
                type="text"
                onClick={() =>
                  alert(`Button clicked: ${item?.originData?.content}`)
                }
              >
                <MessageOutlined /> Default Button
              </Button>
            )}
            {/* </Card> */}
          </div>
        );
      case "richcard_carosal":
        return (
          <div className="chat-message carousel-message">
            {console.log("11-->", item?.originData)}
            {item?.originData?.richCardCarousels?.cards?.map((card, index) => (
              <Flex
                vertical
                gap={12}
                style={{
                  minWidth:
                    item?.originData?.cardWidth === 1
                      ? "200px"
                      : item?.originData?.cardWidth === 0
                      ? "150px"
                      : "150px",
                  maxWidth:
                    item?.originData?.cardWidth === 1
                      ? "200px"
                      : item?.originData?.cardWidth === 0
                      ? "150px"
                      : "150px",
                  background: "rgba(255, 255, 255, 0.7)",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #d9d9d9",
                  borderRadius: "12px",
                  margin: "5px",
                  flexShrink: 0,
                }}
                key={`carousel-${index}`}
              >
                <div
                  style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  <img
                    src={
                      card?.media ||
                      "https://medcities.org/wp-content/uploads/2021/05/generic_image_medcities-1.jpg"
                    }
                    style={{
                      height:
                        card?.size === "short"
                          ? "100px"
                          : card?.size === "tall"
                          ? "150px"
                          : "120px",
                    }}
                    alt="custom content"
                    className="chat-image"
                  />

                  <Typography.Text
                    className="title"
                    style={{ paddingLeft: "5px" }}
                  >
                    <small
                      dangerouslySetInnerHTML={{
                        __html: card?.title?.replace(/\n/g, "<br/>") || "Title",
                      }}
                    />
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: 5,
                      paddingLeft: "5px",
                    }}
                  >
                    <small
                      dangerouslySetInnerHTML={{
                        __html:
                          card?.description
                            ?.trim()
                            ?.replace(/<p>/g, "<span>")
                            ?.replace(/<\/p>/g, "</span>") || "message",
                      }}
                    />
                  </Typography.Text>
                </div>
                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                  }}
                >
                  {card?.actions ? (
                    <>
                      {Array.isArray(card?.actions) &&
                        card?.actions.map((btn, i) => (
                          <React.Fragment key={`button-${i}`}>
                            <Button
                              size="small"
                              block
                              type="text"
                              onClick={() =>
                                handleButtonClick(
                                  btn.title,
                                  item?.originData?.id,
                                  item?.originData?.type,
                                  `handle-${index}-${i}`
                                )
                              }
                            >
                              {btn.type === "quick" && (
                                <Typography.Text>
                                  <MessageOutlined /> {btn?.title}
                                </Typography.Text>
                              )}
                              {btn.type === "call" && (
                                <Typography.Text>
                                  <PhoneOutlined /> {btn?.title}
                                </Typography.Text>
                              )}
                              {btn.type === "url" && (
                                <Typography.Text>
                                  <LinkOutlined /> {btn?.title}
                                </Typography.Text>
                              )}
                              {btn.type === "location" && (
                                <Typography.Text>
                                  <EnvironmentOutlined /> {btn?.title}
                                </Typography.Text>
                              )}
                              {btn.type === "calendar" && (
                                <Typography.Text>
                                  <CalendarOutlined /> {btn?.title}
                                </Typography.Text>
                              )}
                            </Button>
                            {i < card?.actions?.length - 1 && (
                              <Divider style={{ margin: "0px" }} />
                            )}
                          </React.Fragment>
                        ))}
                    </>
                  ) : (
                    <Button
                      size="small"
                      block
                      type="text"
                      onClick={() => alert(`Button clicked: ${card?.content}`)}
                    >
                      <MessageOutlined /> Default Button
                    </Button>
                  )}
                </div>
              </Flex>
            ))}
          </div>
        );
        case "list":
          return (
            <div
              className={`chat-message ${
                item?.originData?.role === "user"
                  ? "reply-message"
                  : "text-message"
              }`}
            >
              {console.log("33-->", item?.originData)}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontWeight: "bold",
                }}
                className="message-text"
                dangerouslySetInnerHTML={{
                  __html:
                    item?.originData?.menuTitle?.replace(/\n/g, "<br/>") ||
                    "message",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
                className="message-text"
                dangerouslySetInnerHTML={{
                  __html:
                    item?.originData?.middleTitle?.replace(/\n/g, "<br/>") ||
                    "message",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
                className="message-text"
                dangerouslySetInnerHTML={{
                  __html:
                    item?.originData?.footerTitle?.replace(/\n/g, "<br/>") ||
                    "message",
                }}
              />
              {Array.isArray(item?.originData?.actions) ? (
                <Divider style={{ margin: "0px" }} />
              ) : (
                ""
              )}
              <Button
                size="small"
                block
                type="text"
                onClick={() => {
                 console.log("button clicked"), 
                 handleOpen(),
                 console.log("button clicked2")
  
                }}
              >
                <MessageOutlined
                  onClick={() => {
                     handleOpen();
                  }}
                />
                List
              </Button>
              <Drawer
                title="Basic Drawer"
                // placement="bottom"
                // closable={true}
                onClose={handleClose} // Use a callback reference
                open={open} // Controlled by state
                // key="bottom"
                style={{ background: "red" }}
              >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
              </Drawer>
              {/* {Array.isArray(item.originData.actions) &&
                item.originData.actions.length > 1 && (
                  <Divider style={{ margin: "0px" }} />
                )} */}
            </div>
          );
      case "Text":
        return (
          <div
            className={`chat-message ${
              item?.originData?.role === "user"
                ? "reply-message"
                : "text-message"
            }`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
              className="message-text"
              dangerouslySetInnerHTML={{
                __html:
                  item?.originData?.content?.replace(/\n/g, "<br/>") ||
                  "message",
              }}
            />
          </div>
        );
      default:
        return (
          <div className="chat-message text-message">
            <p>{item?.originData?.content}</p>
          </div>
        );
    }
  };

  return (
    <div style={{ ...styles, background: "#316FF6" }}>
      <div className="inverted-header-radius">
        <Row align="middle" style={{ padding: "5px" }}>
          <Col md={22} style={{ paddingLeft: "5px" }}>
            <Flex align="center" gap={15}>
              <Badge dot style={{ backgroundColor: "#52c41a" }}>
                <Avatar
                  src="https://via.placeholder.com/40"
                  alt="Bot"
                  style={{ backgroundColor: "#f0f0f0" }}
                />
              </Badge>
              <Flex vertical>
                <Typography.Text style={{ fontWeight: 500, color: "white" }}>
                  Bot
                </Typography.Text>
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: "10px", color: "white" }}
                >
                  Online
                </Typography.Text>
              </Flex>
            </Flex>
          </Col>
          <Col md={2}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <SyncOutlined
                style={{ fontSize: "18px", cursor: "pointer", color: "white" }}
              />
            </div>
          </Col>
        </Row>
        <div
          className="inverted-footer-radius"
          style={{ background: "#316FF6 " }}
        >
          <Row align="middle" gutter={[5, 0]}>
            <Col md={19}>
              <Input
                placeholder="Search..."
                style={{
                  flex: 1,
                  outline: "none",
                  boxShadow: "none",
                  fontSize: "16px",
                  width: "100%",
                }}
              />
            </Col>
            <Col md={5} align="right">
              <PaperClipOutlined
                style={{
                  fontSize: "20px",
                  color: "white",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              />
              <SendOutlined
                style={{
                  fontSize: "20px",
                  color: "white",
                  cursor: "pointer",
                }}
              />
            </Col>
          </Row>
        </div>
      </div>

      <ProChat
        locale="en-US"
        chats={chats}
        style={{ height: 500 }}
        onChatsChange={(chats) => {
          setChats(chats);
        }}
        inputAreaRender={() => {
          return <></>;
        }}
        chatItemRenderConfig={{
          actionsRender: false,
          render: (item) => {
            return <div ref={chatContainerRef}>{renderChatContent(item)}</div>;
          },
        }}
      />
    </div>
  );
};
export default ChatFlow;
