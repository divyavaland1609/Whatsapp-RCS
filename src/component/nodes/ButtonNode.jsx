/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Badge,
  Button,
  Card,
  ConfigProvider,
  Divider,
  Dropdown,
  Flex,
  Switch,
  Typography,
} from "antd";
import { useSelector } from "react-redux";
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
import { useDispatch } from "react-redux";
import {
  setRichCardNodeData,
  setUpdateNodeData,
} from "../redux/reducer.button";
const { Paragraph } = Typography;

const blinkingBorderStyle = {
  animation: "blink-border 1s infinite",
};

const ButtonNode = ({ data, selected }) => {
  const {
    reactFlowWrapper,
    handleDeleteClick,
    createCopyNode,
    edges,
    handleUnsetStart,
    handleSetStart,
  } = data;

  const id = data.id;
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes.find((item) => item.id === id);
  const [enabled, setEnabled] = useState(!alldata?.data?.disabled);
  const [isHovered, setIsHovered] = useState(false);
  const [isConnectedToStartNode, setIsConnectedToStartNode] = useState(false);

  const checkParentNodesForStart = (nodeId) => {
    const parentEdges = edges.filter((edge) => edge.target === nodeId);
    if (parentEdges.length === 0) return false;

    return parentEdges.some((edge) => {
      const parentNode = nodes.find((node) => node.id === edge.source);
      return (
        parentNode?.data?.isStartNode || checkParentNodesForStart(edge.source)
      );
    });
  };
  const isNodeConnected = (nodeId) => {
    return edges.some(
      (edge) => edge.source === nodeId || edge.target === nodeId
    );
  };

  const connected = isNodeConnected(id);

  useEffect(() => {
    const connectedToStart = checkParentNodesForStart(id);
    setIsConnectedToStartNode(connectedToStart);
  }, [edges, id]);

  // const handleNodeStateChange = (checked) => {
  //   setEnabled(checked);

  //   if (data.isStartNode || alldata?.data?.isStartNode) return;

  //   dispatch(
  //     setUpdateNodeData({
  //       selectedNode: id,
  //       key: "disabled",
  //       value: !checked,
  //     })
  //   );

  //   data.toggleNodeState(id, checked);
  // };

  const handleNodeStateChange = (checked) => {
    setEnabled(checked);

    if (data.isStartNode || alldata?.data?.isStartNode) return;

    dispatch(
      setUpdateNodeData({
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
        setUpdateNodeData({
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

  useEffect(() => {
    if (!isConnected) {
      setEnabled(true);
      dispatch(
        setUpdateNodeData({
          selectedNode: id,
          key: "disabled",
          value: false,
        })
      );
    }
  }, [isConnected, dispatch, id]);

  // const checkRightHandleConnected = () => {
  //   return edges.some(
  //     (edge) => edge.source === id && edge.sourceHandle === `handle`
  //   );
  // };

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            lineWidth: 0,
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
      {data.isStartNode && (
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
              background: "rgba(255, 255, 255, 0.2)",
              boxShadow: "0px -10px 15px  rgba(0, 0, 0, 0.2)",
            },
            header: {
              color: "#fff",
              textAlign: "center",
              borderRadius: "14px 14px 14px 0",
              padding: "10px",
              border: "none",
              marginBottom: "-14px",
            },
          }}
          style={{
            width: 200,
            padding: "-1px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.8)",
            boxShadow: selected
              ? "0 1px 10px rgba(64, 150, 255, 0.5)"
              : isConnectedToStartNode
              ? "0 1px 10px rgba(82, 196, 26, 0.5)"
              : "0 1px 10px rgba(0, 0, 0, 0.15)",
            filter: enabled ? "none" : "grayscale(100%) opacity(0.5)",
          }}
        >
          <div
            className="inverted-border-radius  shadow-pink"
            style={{ paddingTop: "1px 1px 1px" }}
          >
            <Flex className="flex-grow" align="center" justify="space-between" >
              <Typography className="title-name">
                {alldata?.data?.templateName ?? "Text with Button"}
              </Typography>

              <Flex gap={5} align="center">
                <Switch
                  style={{ marginBottom: "0px" }}
                  checked={enabled}
                  value={enabled}
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
                    onClick={(e) => e.stopPropagation()}
                  />
                </Dropdown>
              </Flex>
            </Flex>
          </div>

          <div className="card-body">
            {alldata?.data?.isStartNode || data.isStartNode ? null : (
              <>
                <Handle
                  type={"target"}
                  position={Position.Left}
                  isConnectable={true}
                  style={{
                    background: "transparent",
                    position: "absolute",
                    width: "20px",
                    left: "-12px",
                    top: "60%",
                    border: "none",
                    zIndex: 10,
                    transform: "translateY(-50%)",
                  }}
                >
                  <div
                    style={{
                      height: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
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
            <Paragraph
              style={{
                padding: "10px 10px 0px 10px",
                lineHeight: "1.00",
              }}
            >
              <small
                dangerouslySetInnerHTML={{
                  __html:
                    alldata?.data?.label
                      ?.trim()
                      ?.replace(/<p>/g, "<span>")
                      ?.replace(/<\/p>/g, "</span>") || "Default Button Node",
                }}
              ></small>
            </Paragraph>

            {alldata?.data?.actions?.length > 0 ? (
              alldata.data.actions.map((btn, i) => (
                <React.Fragment key={i}>
                  <Button className="btn" size="small" block type="text">
                    {btn.type === "quick" && (
                      <>
                        <Handle
                          id={`handle-${i}`}
                          type={"source"}
                          position={Position.Right}
                          isConnectable={enabled}
                          style={{
                            background: "transparent",
                            position: "absolute",
                            width: "20px",
                            left: "94%",
                            border: "none",
                            top: "52%",
                            height: "50px",
                            zIndex: 10,
                            transform: "translateY(-50%)",
                          }}
                        />
                        <div
                          style={{
                            height: "6px",
                            position: "absolute",
                            top: "-0px",
                            left: "99%",
                          }}
                        >
                          {data?.isStartNode || alldata?.data?.isStartNode ? (
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
                    {btn.type === "copy-code" && (
                      <Typography.Text>
                        <CopyOutlined /> {btn?.title}
                      </Typography.Text>
                    )}
                  </Button>
                  {i < alldata.data.actions.length - 1 && (
                    <Divider style={{ margin: "0px" }} />
                  )}
                </React.Fragment>
              ))
            ) : (
              <Button className="btn" size="small" type="text" block>
                <Handle
                  id={`handle-0`}
                  type={"source"}
                  position={Position.Right}
                  isConnectable={true}
                  style={{
                    background: "transparent",
                    position: "absolute",
                    width: "20px",
                    left: "94%",
                    border: "none",
                    top: "53%",
                    height: "50px",
                    zIndex: 10,
                    transform: "translateY(-50%)",
                  }}
                />
                <div
                  style={{
                    height: "6px",
                    display: "flex",
                    position: "relative",
                    alignItems: "center",
                    justifyContent: "center",
                    top: "0px",
                    left: "80%",
                  }}
                >
                  {data?.isStartNode || alldata?.data?.isStartNode ? (
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
                  {/* {isRightHandleConnected && isConnectedToStartNode ? (
                    <Badge status="success" /> // Green
                  ) : (
                    <Badge status="processing" /> // Blue
                  )} */}
                </div>
                <Typography.Text
                  style={{
                    fontSize: "11px",
                  }}
                >
                  <MessageOutlined />
                  Default Button
                </Typography.Text>
              </Button>
            )}
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default ButtonNode;
