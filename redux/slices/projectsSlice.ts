import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../../pages/lib/api";

// ------------------- TYPES -------------------

export interface Project {
  id: number;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

// Payload for updates
interface UpdateProjectPayload {
  id: number;
  updates: Partial<Project>;
}

// ------------------- THUNKS -------------------

// Fetch all projects
export const fetchProjects = createAsyncThunk<Project[], void, { rejectValue: string }>(
  "projects/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await api.getProjects();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create a new project
export const createProject = createAsyncThunk<Project, Omit<Project, "id">, { rejectValue: string }>(
  "projects/create",
  async (projectData, thunkAPI) => {
    try {
      const data = await api.createProject(projectData);
      return { id: data.id, ...projectData } as Project;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update a project
export const updateProject = createAsyncThunk<UpdateProjectPayload, UpdateProjectPayload, { rejectValue: string }>(
  "projects/update",
  async ({ id, updates }, thunkAPI) => {
    try {
      const result = await api.updateProject(id, updates);
      return { id, updates, result };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete a project
export const deleteProject = createAsyncThunk<{ id: number }, number, { rejectValue: string }>(
  "projects/delete",
  async (id, thunkAPI) => {
    try {
      await api.deleteProject(id);
      return { id };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ------------------- SLICE -------------------

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch projects
    builder.addCase(fetchProjects.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => { state.loading = false; state.projects = action.payload; });
    builder.addCase(fetchProjects.rejected, (state, action) => { state.loading = false; state.error = action.payload || "Error fetching projects"; });

    // Create project
    builder.addCase(createProject.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => { state.loading = false; state.projects.push(action.payload); });
    builder.addCase(createProject.rejected, (state, action) => { state.loading = false; state.error = action.payload || "Error creating project"; });

    // Update project
    builder.addCase(updateProject.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(updateProject.fulfilled, (state, action: PayloadAction<UpdateProjectPayload>) => {
      state.loading = false;
      const idx = state.projects.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.projects[idx] = { ...state.projects[idx], ...action.payload.updates };
    });
    builder.addCase(updateProject.rejected, (state, action) => { state.loading = false; state.error = action.payload || "Error updating project"; });

    // Delete project
    builder.addCase(deleteProject.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(deleteProject.fulfilled, (state, action: PayloadAction<{ id: number }>) => {
      state.loading = false;
      state.projects = state.projects.filter(p => p.id !== action.payload.id);
    });
    builder.addCase(deleteProject.rejected, (state, action) => { state.loading = false; state.error = action.payload || "Error deleting project"; });
  },
});

export default projectsSlice.reducer;
