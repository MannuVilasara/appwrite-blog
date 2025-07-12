import { createSlice } from "@reduxjs/toolkit";
import { log } from "console";

const initialState = {
    status: false,
    user: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.user = action.payload.user;
            log("User logged in:", action.payload);
        },
        logout: (state) => {
            state.status = false;
            state.user = null;
            log("User logged out");
        }

    }
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;