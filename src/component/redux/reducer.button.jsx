import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nodes: [],
  edges: [],
};

export const nodesSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    setNodesState: (state, action) => {
      const newNode = action.payload;
      const nodeIndex = state.nodes.findIndex((node) => node.id === newNode.id);
      if (nodeIndex === -1) {
        state.nodes.push(newNode);
      } else {
        state.nodes[nodeIndex] = { ...state.nodes[nodeIndex], ...newNode };
      }
    },
    setEdgesState: (state, action) => {
      state.edges = action.payload;
    },
    setEmptyState: (state) => {
      state.nodes = [];
      state.edges = [];
    },

    setUpdateNodeData: (state, action) => {
      const { selectedNode, value, key } = action.payload;

      const updatedNodes = state.nodes.map((node) => {
        if (node.id === selectedNode) {
          return {
            ...node,
            data: {
              ...node.data,
              [key]: value,
            },
          };
        }
        return node;
      });

      state.nodes = updatedNodes;
    },

    setRichCardNodeData: (state, action) => {
      const { selectedNode, value, key } = action.payload;

      const updatedNodes = state.nodes.map((node) => {
        if (node.id === selectedNode) {
          if (key === "mediaUrl") {
            return {
              ...node,
              data: {
                ...node.data,
                mediaUrl: value,
              },
            };
          }

          if (key === "enabled") {
            return {
              ...node,
              enabled: value,
            };
          }

          return {
            ...node,
            data: {
              ...node.data,
              [key]: value,
            },
          };
        }
        return node;
      });

      state.nodes = updatedNodes;
    },

    // setRichCardNodeData: (state, action) => {
    //   const { selectedNode, value, key } = action.payload;

    //   const updatedNodes = state.nodes.map((node) => {
    //     if (node.id === selectedNode) {
    //       if (key === "enabled") {
    //         return {
    //           ...node,
    //           enabled: value,
    //         };
    //       }
    //       return {
    //         ...node,
    //         data: {
    //           ...node.data,
    //           [key]: value,
    //         },
    //       };
    //     }
    //     return node;
    //   });

    //   state.nodes = updatedNodes;
    // },

    updateNodeDisabledState: (state, action) => {
      const { nodeId, disabled } = action.payload;
      const findConnectedNodes = (id, visited = new Set()) => {
        if (visited.has(id)) return [];
        visited.add(id);

        const directlyConnected = state.edges
          .filter((edge) => edge.source === id)
          .map((edge) => edge.target);

        return directlyConnected.reduce(
          (acc, target) => [...acc, ...findConnectedNodes(target, visited)],
          directlyConnected
        );
      };

      const affectedNodes = [nodeId, ...findConnectedNodes(nodeId)];
      state.nodes = state.nodes.map((node) =>
        affectedNodes.includes(node.id) ? { ...node, disabled } : node
      );
    },
    setDeleteNodeState: (state, action) => {
      const nodeId = action.payload;
      state.nodes = state.nodes.filter((node) => node.id !== nodeId);
      state.edges = state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );
    },
    
    setRichCardNodeCarousleData: (state, action) => {
      const { selectedNode, value, key } = action.payload;
    
      const updatedNodes = state.nodes.map((node) => {
        if (node.id === selectedNode) {
          // Check if the key is "mediaUrl"
          if (key === "mediaUrl") {
            return {
              ...node,
              data: {
                ...node.data,
                mediaUrl: value, // Update the mediaUrl
              },
            };
          }
          // Handle other key updates
          return {
            ...node,
            data: {
              ...node.data,
              [key]: value,
            },
          };
        }
        return node; // If node id doesn't match, return the node unchanged
      });
    
      // Set the updated nodes in the state
      state.nodes = updatedNodes;
    },

    
    // setRichCardNodeCarousleData: (state, action) => {
    //   const { selectedNode, value, key } = action.payload;

    //   const checked = (state.nodes = state.nodes.map((node) => {
    //     return node.id === selectedNode
    //       ? { ...node, data: { ...node.data, [key]: value } }
    //       : node;
    //   }));
    // },
  },
});

export const {
  setNodesState,
  setEdgesState,
  setEmptyState,
  setUpdateNodeData,
  updateNodeDisabledState,
  setDeleteNodeState,
  setRichCardNodeData,
  setRichCardNodeCarousleData,
} = nodesSlice.actions;
export default nodesSlice.reducer;
