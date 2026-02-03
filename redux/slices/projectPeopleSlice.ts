import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../../pages/lib/api";

// ------------------- TYPES -------------------

export type RoleInProject = "supervisor" | "volunteer";

export interface ProjectPerson {
  id: number;
  project_id: number;
  person_id: number;
  role_in_project: RoleInProject;
  created_at: string;
  project_title?: string;
  first_name?: string;
  last_name?: string;
}

export interface ProjectPeopleState {
  links: ProjectPerson[];
  loading: boolean;
  error: string | null;
}

interface AddPersonPayload {
  project_id: number;
  person_id: number;
  role_in_project: RoleInProject;
}

interface FetchProjectPeopleFilter {
  project_id?: number;
  person_id?: number;
}

// ------------------- THUNKS -------------------

// Fetch all links (optionally filtered)
export const fetchProjectPeople = createAsyncThunk<
  ProjectPerson[],
  FetchProjectPeopleFilter | undefined,
  { rejectValue: string }
>("projectPeople/fetchAll", async (filter, thunkAPI) => {
  try {
    return await api.getProjectPeople(filter);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Add a person to a project
export const addPersonToProject = createAsyncThunk<
  ProjectPerson,
  AddPersonPayload,
  { rejectValue: string }
>("projectPeople/add", async (payload, thunkAPI) => {
  try {
    const data = await api.addPersonToProject(payload);
    return { id: data.id, ...payload, created_at: new Date().toISOString() } as ProjectPerson;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Remove a person from a project
export const removePersonFromProject = createAsyncThunk<
  { id: number },
  number,
  { rejectValue: string }
>("projectPeople/remove", async (id, thunkAPI) => {
  try {
    await api.removePersonFromProject(id);
    return { id };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// ------------------- SLICE -------------------

const initialState: ProjectPeopleState = {
  links: [],
  loading: false,
  error: null,
};

const projectPeopleSlice = createSlice({
  name: "projectPeople",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchProjectPeople.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(fetchProjectPeople.fulfilled, (state, action: PayloadAction<ProjectPerson[]>) => {
      state.loading = false;
      state.links = action.payload;
    });
    builder.addCase(fetchProjectPeople.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error fetching project links";
    });

    // Add
    builder.addCase(addPersonToProject.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(addPersonToProject.fulfilled, (state, action: PayloadAction<ProjectPerson>) => {
      state.loading = false;
      state.links.push(action.payload);
    });
    builder.addCase(addPersonToProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error adding person to project";
    });

    // Remove
    builder.addCase(removePersonFromProject.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(removePersonFromProject.fulfilled, (state, action: PayloadAction<{ id: number }>) => {
      state.loading = false;
      state.links = state.links.filter(link => link.id !== action.payload.id);
    });
    builder.addCase(removePersonFromProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error removing person from project";
    });
  },
});

export default projectPeopleSlice.reducer;
