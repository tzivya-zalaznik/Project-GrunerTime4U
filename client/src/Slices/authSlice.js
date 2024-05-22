import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("token") || "",
        user: localStorage.getItem("user") || "",
        isUserLoggedIn: localStorage.getItem("token") ? true : false,
        userFullName: ""
    },
    reducers: {
        setToken: (state, action) => {
            const token = action.payload.accessToken
            state.token = token
            state.isUserLoggedIn = true
            localStorage.setItem("token", token)
            const user = action.payload.user
            state.user = user
            localStorage.setItem("user", JSON.stringify(user))
        },
        removeToken: (state) => {
            state.token = ""
            state.isUserLoggedIn = false
            localStorage.removeItem("token")
            state.user = ""
            localStorage.removeItem("user")
        }
    }
})

export default authSlice.reducer
export const { setToken, removeToken } = authSlice.actions
// export const selectToken = (state)=>state.auth.token