import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import scheduledNotificationService from "./scheduledNotificationService";
import { toast } from "react-hot-toast";

const initialState = {
  jobs: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
};

export const getAllScheduledNotifications = createAsyncThunk(
  "scheduledNotification/getAll",
  async (_, thunkAPI) => {
    try {
      return await scheduledNotificationService.getAll();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(`Failed to load scheduled notifications: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createScheduledNotification = createAsyncThunk(
  "scheduledNotification/create",
  async (data, thunkAPI) => {
    try {
      const response = await scheduledNotificationService.create(data);
      toast.success("Scheduled notification created successfully!");
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(`Failed to create: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateScheduledNotification = createAsyncThunk(
  "scheduledNotification/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await scheduledNotificationService.update(id, data);
      toast.success("Scheduled notification updated successfully!");
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(`Failed to update: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteScheduledNotification = createAsyncThunk(
  "scheduledNotification/delete",
  async (id, thunkAPI) => {
    try {
      await scheduledNotificationService.remove(id);
      toast.success("Scheduled notification deleted successfully!");
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(`Failed to delete: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const runManualScheduledNotification = createAsyncThunk(
  "scheduledNotification/runManual",
  async (id, thunkAPI) => {
    try {
      const response = await scheduledNotificationService.runManual(id);
      toast.success(response.message || "Manual run triggered successfully!");
      // We need to refresh the list to get the lastRun status
      thunkAPI.dispatch(getAllScheduledNotifications());
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(`Failed to run: ${message}`);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const scheduledNotificationSlice = createSlice({
  name: "scheduledNotification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getAllScheduledNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllScheduledNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload;
      })
      .addCase(getAllScheduledNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createScheduledNotification.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(createScheduledNotification.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.jobs.unshift(action.payload);
      })
      // Update
      .addCase(updateScheduledNotification.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(updateScheduledNotification.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.jobs.findIndex((j) => j._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteScheduledNotification.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
      })
      // Handle submission rejections
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.isSubmitting = false;
          state.error = action.payload;
        }
      );
  },
});

export default scheduledNotificationSlice.reducer;
