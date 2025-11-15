import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://live-wildfire-tracker.onrender.com/getalldata";
//const API_URL = "http://localhost:4200/getalldata";

export const fetchFireData = createAsyncThunk(
  "fire/fetchFireData",
  async (_, { rejectWithValue }) => {
    try {
      console.log("featching data");
      const response = await axios.get(API_URL);
      console.log("successful fetching");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error loading fire data");
    }
  }
);

const fireSlice = createSlice({
  name: "fire",
  initialState: {
    fireData: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearFireData: (state) => {
      state.fireData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFireData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFireData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fireData = action.payload;
      })
      .addCase(fetchFireData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearFireData } = fireSlice.actions;
export default fireSlice.reducer;
