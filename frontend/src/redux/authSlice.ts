import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../type';

const initialState: AuthState = {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state: AuthState, action: PayloadAction<{ token: string; user?: User }>) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            if (action.payload.user) state.user = action.payload.user;
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state: AuthState) => {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('token');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
