/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
// eslint-disable-next-line no-unused-vars
import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  useReactFlow,
  getOutgoers,
  reconnectEdge,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";
import "./index.css";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "./component/sidebar/Sidebar";
import { DnDProvider, useDnD } from "./component/sidebar/DnDContext";
import TextNode from "./component/nodes/TextNode";
import TextNodeSidebar from "./component/sidebar/TextNodeSidebar";
import ButtonNodeSidebar from "./component/sidebar/ButtonNodeSidebar";
import ButtonNode from "./component/nodes/ButtonNode";
import RichcardNode from "./component/nodes/RichcardNode";
import RichcardNodeSidebar from "./component/sidebar/RichcardNodeSidebar";
import RichcardCarouselNode from "./component/nodes/RichcardCarouselNode";
import RichCardCarouselSidebar from "./component/sidebar/RichCardCarouselSidebar";
import MediaNode from "./component/nodes/MediaNode";
import Dagre from "@dagrejs/dagre";
import MediaSidebar from "./component/sidebar/MediaSidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  setDeleteNodeState,
  setNodesState,
  setEmptyState,
  setUpdateNodeData,
} from "./component/redux/reducer.button";
import { Button, message, Tabs } from "antd";
import {
  CloseOutlined,
  CommentOutlined,
  PartitionOutlined,
} from "@ant-design/icons";
import ChatFlow from "./component/ChatFlow";
import { PageContainer, ProLayout } from "@ant-design/pro-components";
import CustomEdge from "./component/CustomEdge";

const defaultNodePosition = {
  x: 250,
  y: 250,
};

const newId = uuidv4();

const newNode = {
  id: newId,
  type: "button",
  position: defaultNodePosition,
  data: { id: newId, label: "Default Button Node", isStartNode: true },
};

const initialNodes = [newNode];
const initialEdges = [];
const getLayoutedElements = (nodes, edges, options) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options?.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
);

const defaultEdgeOptions = {
  animated: true,
  type: "smoothstep",
};

const DnDFlow = () => {
  const dispatch = useDispatch();
  const { fitView, zoomTo, getNodes, getEdges } = useReactFlow();
  const reactFlowWrapper = useRef(null);
  const nodeData = useSelector((state) => state.nodes.nodes);
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const { screenToFlowPosition } = useReactFlow();
  const [setReactFlowInstance] = useState(null);
  const [type] = useDnD();
  const [selectedNode, setSelectedNode] = useState("button");
  const alldata = nodeData.find((item) => item?.id === selectedNode);
  // const [toolbarWidth, setToolbarWidth] = useState(200);
  // const { x, y, zoom } = useViewport();
  const [isTestRunning, setIsTestRunning] = useState(false);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [collapsed, setCollapsed] = useState(false);
  const onLayout = useCallback(
    (direction) => {
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
        zoomTo(1);
      });
    },
    [nodes, edges]
  );

  useEffect(() => {
    dispatch(setEmptyState());
  }, [dispatch]);

  // console.log("edges",edges)

  // useEffect(() => {
  //   if (selectedNode) {
  //     const selectedNodeData = nodes.find((n) => n.id === selectedNode);
  //     if (selectedNodeData) {
  //       const nodeWidth = 200;
  //       setToolbarWidth(nodeWidth * zoom);
  //     }
  //   }
  // }, [zoom, selectedNode, nodes]);

  const isValidConnection = useCallback(
    (connection) => {
      const nodes = getNodes();
      const edges = getEdges();
      const target = nodes.find((node) => node.id === connection.target);
      const hasCycle = (node, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      if (target.id === connection.source) return false;
      return !hasCycle(target);
    },
    [getNodes, getEdges]
  );

  const getNodeConnectionStatus = (nodeId, edges) => {
    const connectedEdges = edges.filter(
      (edge) => edge.source === nodeId || edge.target === nodeId
    );
    return connectedEdges.some(
      (edge) =>
        nodes.find((node) => node.id === edge.target)?.data?.disabled ||
        nodes.find((node) => node.id === edge.source)?.data?.disabled
    );
  };

  const onConnect = useCallback(
    // (params) => setEdges((eds) => addEdge(params, eds)),
    (params) => {
      console.log("Connected:", params);
      setEdges((eds) => addEdge({ ...params, type: "custom"}, eds))
  },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!type) return;
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (
        event.clientX < reactFlowBounds.left ||
        event.clientX > reactFlowBounds.right ||
        event.clientY < reactFlowBounds.top ||
        event.clientY > reactFlowBounds.bottom
      ) {
        return;
      }
      const position = screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newId = uuidv4();
      const newNode = {
        id: newId,
        type,
        position,
        data: {
          id: newId,
          label: `${type} node`,
          isStartNode: false,
          disabled: false,
        },
      };
      setNodes((nds) => {
        if (nodeData.length === 0) {
          delete nds[0].measured;
          dispatch(setNodesState(nds[0]));
          dispatch(setNodesState(newNode));
          return nds.concat(newNode);
        } else {
          dispatch(setNodesState(newNode));
          return nds.concat(newNode);
        }
      });
    },
    [dispatch, nodeData.length, screenToFlowPosition, setNodes, type]
  );

  // const onNodeClick = (event, node) => {
  //   setCollapsed(false);
  //   event.stopPropagation();
  //   setActiveTab("2");
  //   if (nodeData?.length === 0) {
  //     delete node.measured;
  //     dispatch(setNodesState(node));
  //   }
  //   setSelectedNode(node.id);
  // };

  const onNodeClick = (event, node) => {
    event.stopPropagation();
    collapsed ? setActiveTab("1") : setActiveTab("2");

    if (nodeData?.length === 0) {
      delete node.measured;
      dispatch(setNodesState(node));
    }

    // Set the selected node
    setSelectedNode(node.id);
  };

  const onFlowClick = () => {
    setSelectedNode(null);
    // setIsTestRunning(!isTestRunning);
  };

  const handleDeleteClick = (id) => {
    if (alldata?.data?.isStartNode) {
      message.error("Start Node Can't be deleted");
    } else {
      setNodes((prev) => {
        const node = prev.filter((nd) => nd.id !== id);
        dispatch(setDeleteNodeState(id));
        return node;
      });
    }
  };

  const handleUnsetStart = (e, nodeId) => {
    e.preventDefault();
    const selectedNode = nodeId;

    if (nodeData.length === 1) {
      message.info("Please add one more node before unsetting the start node.");
      return;
    }

    setNodes((prev) =>
      prev.map((node) =>
        node.id === selectedNode
          ? { ...node, data: { ...node.data, isStartNode: false } }
          : node
      )
    );

    dispatch(
      setUpdateNodeData({ selectedNode, value: false, key: "isStartNode" })
    );
    setSelectedNode(null);
    message.success("Start node unset successfully.");
  };

  const handleSetStart = (e, nodeId) => {
    e.preventDefault();
    const selectedNode = nodeId;

    const existingStartNode = nodeData.find((node) => node.data?.isStartNode);

    if (existingStartNode) {
      if (existingStartNode.id === selectedNode) {
        message.info("This node is already set as the start node.");
      } else {
        message.info("Another node is already set as the start node.");
      }
      return;
    }

    setNodes((prev) =>
      prev.map((node) =>
        node.id === selectedNode
          ? { ...node, data: { ...node.data, isStartNode: true } }
          : node
      )
    );
    dispatch(
      setUpdateNodeData({ selectedNode, value: true, key: "isStartNode" })
    );
    setSelectedNode(selectedNode);
    message.success("Start node set successfully.");
  };

  const renderSidebar = () => {
    if (!selectedNode) return null;
    const selected = nodes.find((node) => node?.id === selectedNode);
    if (!selected) return null;
    switch (selected.type) {
      case "Text":
        return (
          <div className="sidebar">
            <TextNodeSidebar
              title={"Text"}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              edges={edges}
            />
          </div>
        );
      case "button":
        return (
          <div className="sidebar">
            <ButtonNodeSidebar
              title={"Text With Buttons"}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
            />
          </div>
        );
      case "richcard":
        return (
          <div className="sidebar">
            <RichcardNodeSidebar
              title={"Rich Card"}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
            />
          </div>
        );
      case "richcard_carosal":
        return (
          <div className="sidebar">
            <RichCardCarouselSidebar
              title={"Rich Card Carousel"}
              setSelectedNode={setSelectedNode}
              selectedNode={selectedNode}
            />
          </div>
        );
      case "media":
        return (
          <div className="sidebar">
            <MediaSidebar
              title={"Media"}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
            />
          </div>
        );
      default:
        return null;
    }
  };
  useEffect(() => {
    if (!selectedNode) {
      setActiveTab("1");
    }
  }, [selectedNode]);

  const onReconnect = useCallback(
    (oldEdge, newConnection) =>
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),
    [setEdges]
  );

  const createCopyNode = (event, reactFlowWrapper, alldata) => {
    event.preventDefault();

    if (!alldata || !alldata.data) {
      console.error(
        "alldata is undefined or has an invalid structure:",
        alldata
      );
      return;
    }

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    if (
      event.clientX < reactFlowBounds.left ||
      event.clientX > reactFlowBounds.right ||
      event.clientY < reactFlowBounds.top ||
      event.clientY > reactFlowBounds.bottom
    ) {
      return;
    }

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top - 35,
    };

    const newId = uuidv4();
    const newNode = {
      id: newId,
      type: alldata.type ?? "default",
      position,
      data: {
        ...alldata.data,
        id: newId,
        isStartNode: false,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    dispatch(setNodesState(newNode));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {}, [edges]);

  const handleTestButtonClick = () => {
    setIsTestRunning(!isTestRunning);
  };
  // const getNodeConnectionStatus = (nodeId, edges) => {
  //   return edges.some(
  //     (edge) => edge.source === nodeId || edge.target === nodeId
  //   );
  // };

  const toggleNodeState = useCallback(
    (nodeId, enabled) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: { ...node.data, disabled: !enabled },
              }
            : node
        )
      );

      // Update edges connected to this node
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.source === nodeId || edge.target === nodeId) {
            return {
              ...edge,
              animated: enabled, // Stop animation if node is disabled
            };
          }
          return edge;
        })
      );
    },
    [setNodes, setEdges]
  );

  const items = [
    {
      key: "1",
      label: "Components",
      children: <Sidebar setCollapsed={setCollapsed} collapsed={collapsed} />,
    },
    {
      key: "2",
      label: "Property",
      children: renderSidebar(),
    },
  ];

  return (
    <div>
      <ProLayout
        location={{
          pathname: "/articles/new",
        }}
        onCollapse={(value) => {
          setCollapsed(value), setActiveTab("1");
          activeTab === "2";
        }}
        className="custom-prolayout"
        iconfontUrl="//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js"
        menuContentRender={() => (
          <div className="pro-sidebar">
            <Tabs
              activeKey={activeTab}
              items={items}
              onChange={(key) => {
                setActiveTab(key);
              }}
            />
          </div>
        )}
      >
        <PageContainer
          content={
            <div
              className="page-container-wrapper"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "max-content",
                backgroundColor: "rgb(242, 242, 242)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "174vh",
                  height: "94vh",
                }}
                ref={reactFlowWrapper}
                onClick={onFlowClick}
              >
                <ReactFlow
                  nodes={nodes.map((node) => ({
                    ...node,
                    data: {
                      ...node.data,
                      reactFlowWrapper,
                      isConnected: getNodeConnectionStatus(node.id, edges),
                      edges,
                      handleDeleteClick,
                      createCopyNode,
                      onLayout,
                      setNodes,
                      dispatch,
                      handleUnsetStart,
                      handleSetStart,
                      toggleNodeState,
                    },
                  }))}
                  edges={edges}
                  edgeTypes={{ custom: CustomEdge }}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onReconnect={onReconnect}
                  isValidConnection={isValidConnection}
                  nodeTypes={{
                    Text: TextNode,
                    button: ButtonNode,
                    richcard: RichcardNode,
                    richcard_carosal: RichcardCarouselNode,
                    media: MediaNode,
                  }}
                  fitView 
                  fitViewOptions={{ maxZoom: 1}}
                  defaultEdgeOptions={defaultEdgeOptions}
                  onInit={setReactFlowInstance}
                  onNodeClick={onNodeClick}
                >
                  {/* <div> */}
                    <Controls />
                  {/* </div> */}
                  <Background />
                </ReactFlow>
                <Panel position="bottom-left">
                  <PartitionOutlined
                    className="react-flow__panel react-flow__controls vertical left partition-icon"
                    style={{
                      bottom: 100,
                      padding: 5,
                      left: -15,
                      position: "relative",
                      border: "1px solid #000",
                      borderRadius: "50%",
                    }}
                    onClick={() => onLayout("LR")}
                  />
                </Panel>

                <Panel position="bottom-right">
                  <Button
                    shape="circle"
                    style={{top:"-20px"}}
                    size="large"
                    onClick={handleTestButtonClick}
                    icon={
                      isTestRunning ? <CloseOutlined /> : <CommentOutlined />
                      
                    }
                  />
                  {isTestRunning && (
                    <ChatFlow
                      nodeData={nodeData}
                      edges={edges}
                      styles={{
                        position: "absolute",
                        top: "-515px",
                        right: "60px",
                        borderRadius: 10,
                        // boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        width: 300,
                        zIndex: 10,
                        flexDirection: "column",
                        alignItems: "end",
                        height: 430,
                      }}
                    />
                  )}
                </Panel>
              </div>
            </div>
          }
        ></PageContainer>
      </ProLayout>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow />
    </DnDProvider>
  </ReactFlowProvider>
);
