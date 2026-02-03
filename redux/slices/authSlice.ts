import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../../pages/lib/api";

// ------------------- TYPES -------------------

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username?: string;
  role: "admin" | "super_admin";
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UserState {
  users: User[];
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface UpdateUserPayload {
  id: number;
  updates: Partial<User & { password?: string }>;
}

// ------------------- THUNKS -------------------

// Fetch all users
export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("users/fetchAll", async (_, thunkAPI) => {
  try {
    return await api.getUsers();
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Create new user
export const createUser = createAsyncThunk<
  User,
  Partial<User> & { password: string },
  { rejectValue: string }
>("users/create", async (user, thunkAPI) => {
  try {
    const data = await api.createUser(user);
    return { id: data.id, ...user } as User;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Update user
export const updateUser = createAsyncThunk<
  UpdateUserPayload,
  UpdateUserPayload,
  { rejectValue: string }
>("users/update", async ({ id, updates }, thunkAPI) => {
  try {
    const result = await api.updateUser(id, updates);
    return { id, updates, result };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Delete user
export const deleteUser = createAsyncThunk<
  { id: number; result: any },
  number,
  { rejectValue: string }
>("users/delete", async (id, thunkAPI) => {
  try {
    const result = await api.deleteUser(id);
    return { id, result };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Login
export const loginUser = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>("users/login", async (credentials, thunkAPI) => {
  try {
    const data = await api.loginUser(credentials);
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Logout
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "users/logout",
  async () => {
    await api.setAuthToken(null);
  },
);

// ------------------- SLICE -------------------

const initialState: UserState = {
  users: [],
  currentUser: null,
  token: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      },
    );
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error fetching users";
    });

    // Create user
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.push(action.payload);
      },
    );
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error creating user";
    });

    // Update user
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateUser.fulfilled,
      (state, action: PayloadAction<UpdateUserPayload>) => {
        state.loading = false;
        const idx = state.users.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1)
          state.users[idx] = { ...state.users[idx], ...action.payload.updates };
      },
    );
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error updating user";
    });

    // Delete user
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteUser.fulfilled,
      (state, action: PayloadAction<{ id: number }>) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload.id);
      },
    );
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error deleting user";
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.token;

        // Store token in localStorage
        localStorage.setItem("token", action.payload.token);

        api.setAuthToken(action.payload.token);
      },
    );
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error logging in";
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.currentUser = null;
      state.token = null;

      // Remove token from localStorage
      localStorage.removeItem("token");

      api.setAuthToken(null);
    });
  },
});

import { RootState } from "../store";

export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default userSlice.reducer;


