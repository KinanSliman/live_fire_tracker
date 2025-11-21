import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

let socket = null;

// Internal connection function
const connectWebSocketInternal = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    //   const WS_URL = "ws://localhost:5000";
    const WS_URL = "wss://live-wildfire-tracker.onrender.com";

    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      dispatch(webSocketConnected());
      resolve();
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        dispatch(handleWebSocketMessage(message));
      } catch (error) {
        console.error("❌ Error parsing message:", error);
      }
    };

    socket.onerror = (error) => {
      reject(error);
    };

    socket.onclose = (event) => {
      console.log("🔌 WebSocket disconnected");
      dispatch(webSocketDisconnected());
    };
  });
};

// Helper function to request data and wait for response
const requestDataAndWait = (resolve, reject) => {
  const handleResponse = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "ALL_DATA" || message.type === "INITIAL_DATA") {
        socket.removeEventListener("message", handleResponse);
        resolve({
          data: message.data,
          lastUpdateTime: message.lastUpdateTime || message.timestamp,
        });
      }
    } catch (error) {
      socket.removeEventListener("message", handleResponse);
      reject(error);
    }
  };

  socket.addEventListener("message", handleResponse);
  socket.send(JSON.stringify({ type: "REQUEST_ALL_DATA" }));

  setTimeout(() => {
    socket.removeEventListener("message", handleResponse);
    reject(new Error("Request timeout"));
  }, 10000);
};

// Main thunk - keep the same name for backward compatibility
export const fetchFireData = createAsyncThunk(
  "fire/fetchFireData",
  async (_, { rejectWithValue, dispatch }) => {
    return new Promise((resolve, reject) => {
      // If socket doesn't exist or isn't connected, establish connection first
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        dispatch(connectWebSocketInternal())
          .then(() => {
            // Now request data
            requestDataAndWait(resolve, reject);
          })
          .catch((error) => {
            reject(rejectWithValue(error.message || "Connection failed"));
          });
      } else {
        // Socket is already connected, just request data
        requestDataAndWait(resolve, reject);
      }
    });
  }
);

// Thunk to request last update time
export const requestLastUpdate = createAsyncThunk(
  "fire/requestLastUpdate",
  async (_, { getState, rejectWithValue }) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return rejectWithValue("WebSocket not connected");
    }

    return new Promise((resolve, reject) => {
      const handleResponse = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "LAST_UPDATE_TIME") {
            socket.removeEventListener("message", handleResponse);
            resolve(message.lastUpdateTime);
          }
        } catch (error) {
          socket.removeEventListener("message", handleResponse);
          reject(rejectWithValue("Failed to parse update time response"));
        }
      };

      socket.addEventListener("message", handleResponse);
      socket.send(JSON.stringify({ type: "REQUEST_LAST_UPDATE" }));

      setTimeout(() => {
        socket.removeEventListener("message", handleResponse);
        reject(rejectWithValue("Last update request timeout"));
      }, 5000);
    });
  }
);

// Export for manual WebSocket control (optional)
export const connectWebSocket = createAsyncThunk(
  "fire/connectWebSocket",
  async (_, { dispatch }) => {
    return dispatch(connectWebSocketInternal());
  }
);

const fireSlice = createSlice({
  name: "fire",
  initialState: {
    fireData: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    connectionStatus: "disconnected", // 'disconnected' | 'connecting' | 'connected'
    lastUpdated: null, // Track last server update time
    dataCount: 0,
  },
  reducers: {
    clearFireData: (state) => {
      state.fireData = [];
      state.dataCount = 0;
      state.lastUpdated = null;
    },
    webSocketConnected: (state) => {
      state.connectionStatus = "connected";
      state.error = null;
    },
    webSocketDisconnected: (state) => {
      state.connectionStatus = "disconnected";
    },
    handleWebSocketMessage: (state, action) => {
      const message = action.payload;

      switch (message.type) {
        case "INITIAL_DATA":
        case "ALL_DATA":
        case "DATA_UPDATED":
          state.fireData = message.data;
          state.dataCount = message.count || message.data.length;
          state.lastUpdated = message.lastUpdateTime || message.timestamp;
          state.status = "succeeded";
          state.error = null;
          break;

        case "DATA_COUNT":
          state.dataCount = message.count;
          state.lastUpdated = message.lastUpdateTime || state.lastUpdated;
          break;

        case "LAST_UPDATE_TIME":
          state.lastUpdated = message.lastUpdateTime;
          break;

        case "ERROR":
          state.error = message.message;
          state.status = "failed";
          break;

        case "PONG":
          // Update lastUpdated from pong message if available
          if (message.lastUpdateTime) {
            state.lastUpdated = message.lastUpdateTime;
          }
          break;
      }
    },
    updateLastUpdated: (state, action) => {
      state.lastUpdated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFireData
      .addCase(fetchFireData.pending, (state) => {
        state.status = "loading";
        state.connectionStatus = "connecting";
      })
      .addCase(fetchFireData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fireData = action.payload.data;
        state.lastUpdated = action.payload.lastUpdateTime;
        state.dataCount = action.payload.data.length;
        state.connectionStatus = "connected";
        state.error = null;
      })
      .addCase(fetchFireData.rejected, (state, action) => {
        state.status = "failed";
        state.connectionStatus = "disconnected";
        state.error = action.payload;
      })
      // requestLastUpdate
      .addCase(requestLastUpdate.fulfilled, (state, action) => {
        state.lastUpdated = action.payload;
      });
  },
});

export const {
  clearFireData,
  webSocketConnected,
  webSocketDisconnected,
  handleWebSocketMessage,
  updateLastUpdated,
} = fireSlice.actions;

export default fireSlice.reducer;
