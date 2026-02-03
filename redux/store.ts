// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectsReducer from "./slices/projectsSlice";
import donationsReducer from "./slices/donationSlice"; // fixed typo
import peopleReducer from "./slices/peopleSlice";
import projectPeopleReducer from "./slices/projectPeopleSlice";
import projectImagesReducer from "./slices/ProjectImagesSlice";
import partnersReducer from "./slices/partnersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    donations: donationsReducer,
    people: peopleReducer,
    projectPeople: projectPeopleReducer,
    projectImages: projectImagesReducer,
    partners: partnersReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
