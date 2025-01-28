/* eslint-disable react/prop-types */
import {
  ArrowRightOutlined,
  CalendarOutlined,
  CopyOutlined,
  DeleteOutlined,
  DisconnectOutlined,
  EnvironmentOutlined,
  FlagOutlined,
  LinkOutlined,
  MessageOutlined,
  MoreOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Handle, Position } from "@xyflow/react";
import {
  Badge,
  Button,
  Card,
  ConfigProvider,
  Divider,
  Dropdown,
  Flex,
  Image,
  Switch,
  Typography,
} from "antd";
import { setRichCardNodeCarousleData } from "../redux/reducer.button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

const blinkingBorderStyle = {
  animation: "blink-border 1s infinite",
};
function RichcardCarouselNode({ data, selected }) {
  const {
    reactFlowWrapper,
    handleDeleteClick,
    createCopyNode,
    handleUnsetStart,
    handleSetStart,
    edges,
  } = data;
  const dispatch = useDispatch();
  const id = data.id;
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes?.find((element) => element?.id === id);

  // console.log("555-->", alldata);

  const [enabled, setEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isConnectedToStartNode, setIsConnectedToStartNode] = useState(false);
  const [isRightHandleConnected, setIsRightHandleConnected] = useState(false);
  // console.log("all-->data", alldata);
  const checkParentNodesForStart = (nodeId) => {
    const parentEdges = edges.filter((edge) => edge.target === nodeId);
    // console.log("parentEdges:", parentEdges);
    if (parentEdges.length === 0) return false;

    return parentEdges.some((edge) => {
      const parentNode = nodes.find((node) => node.id === edge.source);
      return (
        parentNode?.data?.isStartNode || checkParentNodesForStart(edge.source)
      );
    });
  };

  useEffect(() => {
    const connectedToStart = checkParentNodesForStart(id);
    setIsConnectedToStartNode(connectedToStart);
  }, [edges, id]);

  const defaultCards = [
    {
      title: "Card Title",
      description: "Card Description",
      imageUrl: "",
      actions: [],
    },
    {
      title: "Card Title",
      description: "Card Description",
      imageUrl: "",
      actions: [],
    },
  ];

  const cardsToShow =
    alldata?.data?.richCardCarousels?.cards?.length > 0
      ? alldata?.data?.richCardCarousels?.cards
      : defaultCards;

  const isLastNodeConnect = () => {
    const edgesofCurentNode = edges
      .filter((edge) => edge.target === id)
      .map((item) => item.source);
    const currentEdges = [...new Set(edgesofCurentNode)];

    const disabledNodes = nodes
      ?.filter((node) => node.data.disabled === true)
      ?.filter((node) => currentEdges.includes(node.id));

    // console.log("isConnected", disabledNodes, currentEdges);

    return disabledNodes.length === currentEdges.length &&
      currentEdges.length > 0
      ? true
      : false;
  };

  const isConnected = isLastNodeConnect();
  // console.log("isConnected", isConnected);

  const nodeStyle = {
    // opacity: isConnected ? 0.5 : 1,
    filter: isConnected ? "grayscale(100%) opacity(0.5)" : "none",
    border: !enabled
      ? "3px solid #D9D9D9"
      : isHovered
      ? "3px solid #4096FF"
      : isConnectedToStartNode
      ? "3px solid #52C41A"
      : "3px solid transparent",
    boxShadow: !enabled
      ? "none"
      : isHovered
      ? "0 0 10px rgba(64, 150, 255, 0.9)"
      : isConnectedToStartNode
      ? "0 0 10px rgba(82, 196, 26, 0.9)"
      : "none",
  };

  const handleNodeStateChange = (checked) => {
    if (data.isStartNode || alldata?.data?.isStartNode) return;

    setEnabled(checked);

    dispatch(
      setRichCardNodeCarousleData({
        selectedNode: id,
        key: "disabled",
        value: !checked,
      })
    );

    data.toggleNodeState(id, checked);
    const connectedNodes = findNodesTillLast(id);
    // console.log("Connected Nodes:", connectedNodes);

    // Disable all the connected nodes
    connectedNodes.forEach((node) => {
      // Dispatch action to disable each connected node
      dispatch(
        setRichCardNodeCarousleData({
          selectedNode: node.id,
          key: "disabled",
          value: !node.data.disabled, // Disabling the node
        })
      );
      // Toggle the state of the connected node to 'disabled'
      data.toggleNodeState(node.id, node.data.disabled); // Disabling the node
    });
  };

  const findNodesTillLast = (sourceId, visitedNodes = new Set()) => {
    let connectedNodes = [];

    // Prevent visiting the same node again
    if (visitedNodes.has(sourceId)) {
      return connectedNodes; // Return early if the node has already been visited
    }

    // Mark this node as visited
    visitedNodes.add(sourceId);

    // Find all edges connected to the current sourceId
    const edgesOfCurrentNode = edges.filter((edge) => edge.source === sourceId);

    // Loop through all connected edges
    edgesOfCurrentNode.forEach((edge) => {
      // Find the target node connected through the edge
      const nextNode = nodes.find((node) => node.id === edge.target);

      if (nextNode) {
        connectedNodes.push(nextNode); // Add connected node to the list
        // Recursively find the next connected nodes
        const nextConnectedNodes = findNodesTillLast(nextNode.id, visitedNodes);
        connectedNodes = [...connectedNodes, ...nextConnectedNodes];
      }
    });

    return connectedNodes;
  };

  useEffect(() => {
    if (!isConnected) {
      setEnabled(true);
      dispatch(
        setRichCardNodeCarousleData({
          selectedNode: id,
          key: "disabled",
          value: false,
        })
      );
    }
  }, [isConnected, dispatch, id]);

  const items = [
    alldata?.data?.isStartNode
      ? {
          key: "unsetStartNode",
          label: (
            <Typography
              onClick={(e) => {
                e.preventDefault();
                handleUnsetStart(e, id);
              }}
            >
              <DisconnectOutlined style={{ fontSize: "20px" }} />
              Unset start node
            </Typography>
          ),
        }
      : {
          key: "setStartNode",
          label: (
            <Typography
              onClick={(e) => {
                e.preventDefault();
                handleSetStart(e, id);
              }}
            >
              <FlagOutlined style={{ fontSize: "20px" }} />
              Set start node
            </Typography>
          ),
        },
    {
      key: "copy",
      label: (
        <Typography
          onClick={(e) => {
            e.stopPropagation();
            createCopyNode(e, reactFlowWrapper, alldata);
          }}
        >
          <CopyOutlined style={{ fontSize: "20px" }} />
          copy
        </Typography>
      ),
    },
    {
      key: "delete",
      label: (
        <Typography
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick(id, data);
          }}
        >
          <DeleteOutlined style={{ fontSize: "20px" }} />
          Delete
        </Typography>
      ),
    },
  ];

  const checkRightHandleConnected = () => {
    // console.log("Checking edges:", edges);

    const isConnected = edges.some(
      (edge) => edge.source === id && edge.sourceHandle === "handle"
    );
    // console.log("isRightHandleConnected:", isConnected);

    return isConnected;
  };

  useEffect(() => {
    const connected = checkRightHandleConnected();
    setIsRightHandleConnected(connected);
  }, [edges]);

  // console.log("isRightHandleConnected:", isRightHandleConnected);
  // console.log("isConnectedToStartNode:", isConnectedToStartNode);
  const isNodeConnected = (nodeId) => {
    return edges.some(
      (edge) => edge.source === nodeId || edge.target === nodeId
    );
  };
  const connected = isNodeConnected(id);
  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerBg:
              "linear-gradient(to bottom, #FF6F40 0%, #FF6F40 70%, rgba(255, 255, 255, 0) 90%, rgba(255, 255, 255, 0) 100%)",
            headerHeight: 92,
          },
          Button: {
            textHoverBg: "#ffffff",
            colorBgTextActive: "#ffffff",
            textTextActiveColor: "rgb(47,84,235)",
          },
          Badge: {
            statusSize: 8,
          },
          Typography: {
            fontSize: 12,
          },
          Switch: {
            fontSize: 7,
          },
        },
      }}
    >
      {alldata?.data?.isStartNode && (
        <>
          <Badge className="badge" />
          <Button
            type="text"
            icon={<ArrowRightOutlined className="arrowRightOutlined" />}
            style={{
              marginBottom: "5px",
              border: "1px solid #D9D9D9",
              borderRadius: "20px",
              padding: "6px 12px",
              fontSize: "14px",
              background: "#fff",
              ...blinkingBorderStyle,
            }}
          >
            <Typography.Text>Start</Typography.Text>
          </Button>
        </>
      )}
      <div
        style={{
          borderRadius: "16px",
          paddingTop: "1px",
          ...nodeStyle,
        }}
        onMouseEnter={() => {
          if (enabled) setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card
          styles={{
            body: {
              padding: "0px",
              borderRadius: "14px",
              background: "transparent",
              boxShadow: "0px -10px 15px rgba(0, 0, 0, 0.2)",
            },
            header: {
              color: "#fff",
              textAlign: "center",
              borderRadius: "14px 14px 0 0",
              padding: "10px",
              marginBottom: "-14px",
              border: "none",
            },
          }}
          style={{
            paddingTop: "2px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.5)",
            boxShadow: selected
              ? "0 1px 10px rgba(64, 150, 255, 0.5)"
              : isConnectedToStartNode
              ? "0 1px 10px rgba(82, 196, 26, 0.5)"
              : "0 1px 10px rgba(0, 0, 0, 0.15)",
            filter: enabled ? "none" : "grayscale(100%) opacity(0.5)",
          }}
        >
          <div className="inverted-border-radius  shadow-orange">
            <Flex className="flex-grow" align="center" justify="space-between">
              <Typography className="title-name" style={{ marginTop: "-19px" }}>
                {alldata?.data?.templateName ?? "Rich Card Carousel"}
              </Typography>

              <Flex gap={5} align="center">
                <Switch
                  style={{ marginBottom: "18px" }}
                  checked={enabled}
                  disabled={data.isStartNode || alldata?.data?.isStartNode}
                  onChange={(checked) => handleNodeStateChange(checked)}
                />
                <Dropdown
                  menu={{
                    items,
                  }}
                  trigger={["click"]}
                  placement="topLeft"
                >
                  <MoreOutlined
                    className="more-outlined-icon"
                    style={{ marginBottom: "16px" }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Dropdown>
              </Flex>
            </Flex>
          </div>

          {alldata?.data?.isStartNode ? null : (
            <>
              <Handle
                type={"target"}
                position={Position.Left}
                isConnectable={enabled ? true : false}
                style={{
                  background: "transparent",
                  position: "absolute",
                  width: "20px",
                  left: "-9px",
                  top: "55%",
                  border: "none",
                  zIndex: 10,
                  transform: "translateY(-50%)",
                }}
              >
                <div
                  style={{
                    height: "7px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    left: "-2px",
                  }}
                >
                  {isConnectedToStartNode ? (
                    <Badge status="success" />
                  ) : (
                    <Badge status="processing" />
                  )}
                </div>
              </Handle>
            </>
          )}
          <div
            className="card-body"
            style={{
              padding: " 16px 12px 12px",
            }}
          >
            <Flex
              direction="column"
              gap={7}
              style={{
                padding: "0",
              }}
            >
              {cardsToShow.map((card, index) => {
                return (
                  <Flex
                    key={`card-${index}`}
                    vertical
                    gap={12}
                    style={{
                      width: "50%",
                      background: "rgba(255, 255, 255, 0.7)",
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid #d9d9d9",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Image
                        style={{
                          borderRadius: "11px",
                          objectFit: "cover",
                          height:
                            card?.size === "short"
                              ? "100px"
                              : card?.size === "tall"
                              ? "150px"
                              : "120px",
                          width:
                            alldata?.data?.cardWidth === 1
                              ? "12vw"
                              : alldata?.data?.cardWidth === 0
                              ? "9vw"
                              : "9vw",
                        }}
                        preview={false}
                        alt="example"
                        src={
                          card?.media ||
                          "https://medcities.org/wp-content/uploads/2021/05/generic_image_medcities-1.jpg"
                        }
                      />

                      <Typography
                        style={{
                          fontWeight: 600,
                          fontSize: "11px",
                          marginTop: "10px",
                          alignSelf: "flex-start",
                          paddingLeft: "5px",
                          width:
                            alldata?.data?.cardWidth === 1
                              ? "12vw"
                              : alldata?.data?.cardWidth === 0
                              ? "9vw"
                              : "9vw",
                        }}
                      >
                        {card?.title ?? "Card  Title"}
                      </Typography>
                      <Paragraph
                        style={{
                          width:
                            alldata?.data?.cardWidth === 1
                              ? "12vw"
                              : alldata?.data?.cardWidth === 0
                              ? "9vw"
                              : "9vw",
                          padding: "0px 5px 0px 5px",
                          lineHeight: "1.00",
                        }}
                      >
                        <small
                          dangerouslySetInnerHTML={{
                            __html:
                              card?.description
                                ?.trim()
                                ?.replace(/<p>/g, "<span>")
                                ?.replace(/<\/p>/g, "</span>") ??
                              " Card description",
                          }}
                        ></small>
                      </Paragraph>
                    </div>
                    <div
                      style={{
                        marginTop: "auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        justifyContent: "flex-start",
                      }}
                    >
                      {card?.actions?.length > 0 ? (
                        card.actions.map((action, actionIndex) => (
                          <div key={`btn-${index}-${actionIndex}`}>
                            <Button
                              className="btn"
                              key={actionIndex}
                              size="small"
                              block
                              type="text"
                            >
                              {/* {console.log("Edges",`handle-${index}-${actionIndex}`)} */}
                              {action?.type === "quick" && (
                                <>
                                  <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={`handle-${index}-${actionIndex}`}
                                    isConnectable={enabled}
                                    isConnectableStart
                                    style={{
                                      background: "transparent",
                                      position: "absolute",
                                      width: "20px",
                                      left: "95%",
                                      border: "none",
                                      top: "56%",
                                      height: "50px",
                                      zIndex: 10,
                                      transform: "translateY(-50%)",
                                    }}
                                  />
                                  <div
                                    style={{
                                      height: "6px",
                                      display: "flex",
                                      position: "absolute",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      top: "40%",
                                      left: "98%",
                                    }}
                                  >
                                    {data?.isStartNode ||
                                    alldata?.data?.isStartNode ? (
                                      <>
                                        {connected ? (
                                          <Badge status="success" />
                                        ) : (
                                          <Badge status="processing" />
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        {isConnectedToStartNode ? (
                                          <Badge status="success" />
                                        ) : (
                                          <Badge status="processing" />
                                        )}
                                      </>
                                    )}
                                  </div>
                                </>
                              )}
                              {action.type === "quick" && (
                                <Typography.Text>
                                  <MessageOutlined /> {action?.title}
                                </Typography.Text>
                              )}
                              {action.type === "call" && (
                                <Typography.Text>
                                  <PhoneOutlined /> {action?.title}
                                </Typography.Text>
                              )}
                              {action.type === "url" && (
                                <Typography.Text>
                                  <LinkOutlined /> {action?.title}
                                </Typography.Text>
                              )}
                              {action.type === "copy-code" && (
                                <Typography.Text>
                                  <CopyOutlined /> {action?.title}
                                </Typography.Text>
                              )}
                            </Button>
                            {actionIndex < card.actions.length - 1 && (
                              <Divider style={{ margin: "0px" }} />
                            )}
                          </div>
                        ))
                      ) : (
                        <>
                          <Button
                            className="btn"
                            size="small"
                            type="text"
                            block
                          >
                            <Handle
                              type="source"
                              id={`handle-${index}`}
                              position={Position.Right}
                              isConnectable={enabled ? true : false}
                              style={{
                                background: "transparent",
                                position: "absolute",
                                width: "30px",
                                left:
                                  alldata?.data?.cardWidth === 1
                                    ? "90%"
                                    : alldata?.data?.cardWidth === 0
                                    ? "85%"
                                    : "90%",
                                right: "270%",
                                border: "none",
                                top: "60%",
                                height: "50px",
                                zIndex: 10,
                                transform: "translateY(-50%)",
                              }}
                            />
                            <div
                              style={{
                                height: "6px",
                                display: "flex",
                                position: "absolute",
                                alignItems: "center",
                                justifyContent: "center",
                                top: "40%",
                                left: "98%",
                              }}
                            >
                              {data?.isStartNode ||
                              alldata?.data?.isStartNode ? (
                                <>
                                  {connected ? (
                                    <Badge status="success" />
                                  ) : (
                                    <Badge status="processing" />
                                  )}
                                </>
                              ) : (
                                <>
                                  {isConnectedToStartNode ? (
                                    <Badge status="success" />
                                  ) : (
                                    <Badge status="processing" />
                                  )}
                                </>
                              )}
                            </div>
                            <Typography.Text style={{ fontSize: "11px" }}>
                              <MessageOutlined /> Default Button
                            </Typography.Text>
                          </Button>
                        </>
                      )}
                    </div>
                  </Flex>
                );
              })}
            </Flex>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
}

export default RichcardCarouselNode;
