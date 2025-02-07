// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// import React, { useState, useEffect } from "react";
// import { Handle, Position } from "@xyflow/react";
// import {
//   Badge,
//   Button,
//   Card,
//   ConfigProvider,
//   Dropdown,
//   Flex,
//   Switch,
//   Typography,
// } from "antd";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   ArrowRightOutlined,
//   CopyOutlined,
//   DeleteOutlined,
//   DisconnectOutlined,
//   FlagOutlined,
//   MoreOutlined,
// } from "@ant-design/icons";
// import { setUpdateNodeData } from "../redux/reducer.button";
// const { Paragraph } = Typography;
// const blinkingBorderStyle = {
//   animation: "blink-border 1s infinite",
// };

// const TextNode = ({ data, selected }) => {
//   const {
//     reactFlowWrapper,
//     handleDeleteClick,
//     createCopyNode,
//     handleUnsetStart,
//     edges,
//     handleSetStart,
//   } = data;

//   const id = data.id;
//   const dispatch = useDispatch();
//   const nodes = useSelector((state) => state.nodes.nodes);
//   const alldata = nodes.find((item) => item.id === id);

//   const [enabled, setEnabled] = useState(!alldata?.data?.disabled);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isConnected, setIsConnected] = useState();
//   const [isConnectedToStartNode, setIsConnectedToStartNode] = useState(false);
//   const [isRightHandleConnected, setIsRightHandleConnected] = useState(false);

//   // Helper function to check connection with start node

//   const checkParentNodesForStart = (nodeId) => {
//     const parentEdges = edges.filter((edge) => edge.target === nodeId);
//     if (parentEdges.length === 0) return false;

//     return parentEdges.some((edge) => {
//       const parentNode = nodes.find((node) => node.id === edge.source);
//       return (
//         parentNode?.data?.isStartNode || checkParentNodesForStart(edge.source)
//       );
//     });
//   };

//  useEffect(() => {
//     const connectedToStart = checkParentNodesForStart(id);
//     setIsConnectedToStartNode(connectedToStart);
//   }, [edges, id]);

//   const handleNodeStateChange = (checked) => {
//     setEnabled(checked);

//     if (data.isStartNode || alldata?.data?.isStartNode) return;

//     dispatch(
//       setUpdateNodeData({
//         selectedNode: id,
//         key: "disabled",
//         value: !checked,
//       })
//     );
//   };

//   // const isConnectedToStartNode = isNodeConnectedToStartNode(id);

//   const isNodeConnected = (nodeId) =>
//     edges.some((edge) => edge.source === nodeId || edge.target === nodeId);

//   // const handleNodeStateChange = (checked) => {
//   //   setEnabled(checked);
//   //   if (data.isStartNode || alldata?.data?.isStartNode) return;
//   //   dispatch(
//   //     setUpdateNodeData({
//   //       selectedNode: id,
//   //       key: "disabled",
//   //       value: !checked,
//   //     })
//   //   );
//   // };

//   const nodeStyle = {
//     opacity: alldata?.data?.disabled ? 0.5 : 1,
//     // border: isHovered
//     //   ? "3px solid #4096FF"
//     //   : isConnectedToStartNode
//     //   ? "3px solid #52C41A"
//     //   : "3px solid #1890FF",
//   };

//   const checkRightHandleConnected = () => {
//     return edges.some(
//       (edge) => edge.source === id && edge.sourceHandle === `handle`
//     );
//   };

//   useEffect(() => {
//     const connected = checkRightHandleConnected();
//     setIsRightHandleConnected(connected);
//   }, [edges]);

//   const items = [
//     alldata?.data?.isStartNode
//       ? {
//           key: "unsetStartNode",
//           label: (
//             <Typography onClick={(e) => handleUnsetStart(e, id)}>
//               <DisconnectOutlined style={{ fontSize: "20px" }} />
//               Unset start node
//             </Typography>
//           ),
//         }
//       : {
//           key: "setStartNode",
//           label: (
//             <Typography onClick={(e) => handleSetStart(e, id)}>
//               <FlagOutlined style={{ fontSize: "20px" }} />
//               Set start node
//             </Typography>
//           ),
//         },
//     {
//       key: "copy",
//       label: (
//         <Typography
//           onClick={(e) => createCopyNode(e, reactFlowWrapper, alldata)}
//         >
//           <CopyOutlined style={{ fontSize: "20px" }} />
//           Copy
//         </Typography>
//       ),
//     },
//     {
//       key: "delete",
//       label: (
//         <Typography onClick={() => handleDeleteClick(id, data)}>
//           <DeleteOutlined style={{ fontSize: "20px" }} />
//           Delete
//         </Typography>
//       ),
//     },
//   ];

//   return (
//     <>
//       <ConfigProvider
//         theme={{
//           components: {
//             Badge: {
//               statusSize: 8,
//             },
//             Switch: {
//               fontSize: 7,
//             },
//           },
//         }}
//       >
//         {alldata?.data?.isStartNode && (
//           <>
//             <Badge className="badge" />
//             <Button
//               className="start-node-button"
//               type="text"
//               icon={<ArrowRightOutlined className="arrowRightOutlined" />}
//               style={{
//                 marginBottom: "5px",
//                 border: "1px solid #D9D9D9",
//                 borderRadius: "20px",
//                 padding: "6px 12px",
//                 fontSize: "14px",
//                 background: "#fff",
//                 ...blinkingBorderStyle,
//               }}
//             >
//               <Typography.Text>Start</Typography.Text>
//             </Button>
//           </>
//         )}
//         <div
//           style={{
//             borderRadius: "16px",
//             paddingTop: "1px",
//             border: isHovered
//               ? "3px solid #4096FF"
//               : isConnectedToStartNode // Green border when connected to start node
//               ? "3px solid #52C41A"
//               : "3px solid transparent",
//             ...nodeStyle,
//           }}
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           <Card
//             bodyStyle={{
//               padding: "0px",
//               borderRadius: "14px",
//               boxShadow: "0px -10px 15px rgba(0, 0, 0, 0.2)",
//               margin: "0px -1px 0px -1px",
//             }}
//             style={{
//               width: 203,
//               padding: "-1px",
//               borderRadius: "14px",
//               background: "rgba(255, 255, 255, 0.8)",
//               boxShadow: selected
//                 ? "0 1px 10px rgba(64, 150, 255, 0.5)"
//                 : isConnectedToStartNode
//                 ? "0 1px 10px rgba(82, 196, 26, 0.5)" // Green shadow when connected to start node
//                 : "0 1px 10px rgba(0, 0, 0, 0.15)",
//               filter: enabled ? "none" : "grayscale(100%) opacity(0.5)",
//             }}
//           >
//             <div className="inverted-border-radius shadow-blue">
//               <Flex
//                 className="flex-grow"
//                 align="center"
//                 justify="space-between"
//               >
//                 <Typography
//                   className="title-name "
//                   style={{ marginBottom: "7px" }}
//                 >
//                   {alldata?.data?.templateName ?? "Send Message"}
//                 </Typography>

//                 <Flex gap={5} align="center">
//                   <Switch
//                     style={{ marginBottom: "7px" }}
//                     checked={enabled}
//                     disabled={data.isStartNode || alldata?.data?.isStartNode}
//                     onChange={(checked) => handleNodeStateChange(checked)}
//                   />
//                   <Dropdown
//                     menu={{
//                       items,
//                     }}
//                     trigger={["click"]}
//                     placement="topLeft"
//                   >
//                     <MoreOutlined
//                       style={{ marginBottom: "7px" }}
//                       className="more-outlined-icon"
//                       onClick={(e) => e.stopPropagation()}
//                     />
//                   </Dropdown>
//                 </Flex>
//               </Flex>
//             </div>

//             <div className="card-body">
//               <Handle
//                 type={
//                   alldata?.data?.isStartNode || data.isStartNode
//                     ? "source"
//                     : "target"
//                 }
//                 position={
//                   alldata?.data?.isStartNode ? Position.Right : Position.Left
//                 }
//                 isConnectable={true}
//                 style={{
//                   background: "transparent",
//                   position: "absolute",
//                   width: "20px",
//                   left: alldata?.data?.isStartNode ? "auto" : "-8px",
//                   right: alldata?.data?.isStartNode ? "-6px" : "auto",
//                   border: "none",
//                   top: "56%",
//                   height: "50px",
//                   zIndex: 10,
//                   transform: "translateY(-50%)",
//                 }}
//               />
//               <div
//                 style={{
//                   height: "6px",
//                   display: "flex",
//                   position: "relative",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   top: "15px",
//                   left: alldata?.data?.isStartNode ? "auto" : "-102px",
//                   right: alldata?.data?.isStartNode ? "-100px" : "auto",
//                 }}
//               >
//                 {isConnectedToStartNode   ? (
//                   <Badge status="success" />
//                 ) : (
//                   <Badge status="processing" />
//                 )}
//               </div>{" "}
//               <Paragraph
//                 style={{
//                   lineHeight: "1.00",
//                   paddingLeft: "10px",
//                   padding: "5px",
//                 }}
//               >
//                 <small
//                   dangerouslySetInnerHTML={{
//                     __html:
//                       alldata?.data?.label?.replace(/\n/g, "<br/>") ||
//                       "message",
//                   }}
//                 ></small>
//               </Paragraph>
//             </div>
//           </Card>
//         </div>
//       </ConfigProvider>
//     </>
//   );
// };

// export default TextNode;

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Badge,
  Button,
  Card,
  ConfigProvider,
  Dropdown,
  Flex,
  Switch,
  Typography,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowRightOutlined,
  CopyOutlined,
  DeleteOutlined,
  DisconnectOutlined,
  FlagOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  setRichCardNodeData,
  setUpdateNodeData,
} from "../redux/reducer.button";
const { Paragraph } = Typography;
const blinkingBorderStyle = {
  animation: "blink-border 1s infinite",
};

const TextNode = ({ data, selected }) => {
  const {
    reactFlowWrapper,
    handleDeleteClick,
    createCopyNode,
    handleUnsetStart,
    edges,
    handleSetStart,
  } = data;

  const id = data.id;
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes.find((item) => item.id === id);
  // console.log("alldata",alldata)
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
  }, [id, nodes, edges]);

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

    // console.log("isConnected", disabledNodes,currentEdges);

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
            <Typography onClick={(e) => handleUnsetStart(e, id)}>
              <DisconnectOutlined style={{ fontSize: "20px" }} />
              Unset start node
            </Typography>
          ),
        }
      : {
          key: "setStartNode",
          label: (
            <Typography onClick={(e) => handleSetStart(e, id)}>
              <FlagOutlined style={{ fontSize: "20px" }} />
              Set start node
            </Typography>
          ),
        },
    {
      key: "copy",
      label: (
        <Typography
          onClick={(e) => createCopyNode(e, reactFlowWrapper, alldata)}
        >
          <CopyOutlined style={{ fontSize: "20px" }} />
          Copy
        </Typography>
      ),
    },
    {
      key: "delete",
      label: (
        <Typography onClick={() => handleDeleteClick(id, data)}>
          <DeleteOutlined style={{ fontSize: "20px" }} />
          Delete
        </Typography>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Badge: {
            statusSize: 8,
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
            className="start-node-button"
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
              boxShadow: "0px -10px 15px rgba(0, 0, 0, 0.2)",
              margin: "0px -1px 0px -1px",
            },
          }}
          style={{
            width: 203,
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
          <div className="inverted-border-radius shadow-blue">
            <Flex
              className="flex-grow"
              align="center"
              justify="space-between"
              style={{ padding: "5px" }}
            >
              <Typography
                className="title-name"
                style={{ marginBottom: "7px" }}
              >
                {alldata?.data?.templateName ?? "Send Message"}
              </Typography>
              <Flex gap={5} align="center">
                <Switch
                  style={{ marginBottom: "7px" }}
                  checked={enabled}
                  disabled={data.isStartNode || alldata?.data?.isStartNode}
                  onChange={(checked) => handleNodeStateChange(checked)}
                />
                <Dropdown
                  menu={{ items }}
                  trigger={["click"]}
                  placement="topLeft"
                >
                  <MoreOutlined
                    style={{ marginBottom: "7px" }}
                    className="more-outlined-icon"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Dropdown>
              </Flex>
            </Flex>
          </div>
          <div className="card-body">
            <Handle
              type={
                alldata?.data?.isStartNode || data.isStartNode
                  ? "source"
                  : "target"
              }
              position={
                alldata?.data?.isStartNode ? Position.Right : Position.Left
              }
              isConnectable={enabled}
              style={{
                background: "transparent",
                position: "absolute",
                width: "20px",
                left: alldata?.data?.isStartNode ? "auto" : "-8px",
                right: alldata?.data?.isStartNode ? "-6px" : "auto",
                border: "none",
                top: "58%",
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
                top: "15px",
                left: alldata?.data?.isStartNode ? "auto" : "-104px",
                right: alldata?.data?.isStartNode ? "-100px" : "auto",
              }}
            >
              {data?.isStartNode || alldata?.data?.isStartNode ? (
                <Badge status={connected ? "success" : "processing"} />
              ) : (
                <Badge
                  status={isConnectedToStartNode ? "success" : "processing"}
                />
              )}
            </div>
            <Paragraph
              style={{
                padding: "10px 10px 0px",
                lineHeight: "1.00",
                // paddingLeft:"5px"
              }}
            >
              <small
                dangerouslySetInnerHTML={{
                  __html:
                    alldata?.data?.label
                      ?.trim()
                      ?.replace(/<p>/g, "<span>")
                      ?.replace(/<\/p>/g, "</span>") || "Text Node",
                }}
              />
            </Paragraph>
          
          </div>
          <Paragraph
            type="secondary"
            style={{
              padding: "0px 10px",
              // padding: "8px",
            }}
          >
            <small>{alldata?.data?.footerTitle || "footer Title"}</small>
          </Paragraph>
        </Card>
      </div>
    </ConfigProvider>
  );
};
export default TextNode;
