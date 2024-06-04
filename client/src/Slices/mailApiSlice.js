import apiSlice from "../app/apiSlice"

const mailApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        sendEmail: build.mutation({
            query:(obj)=>({
                url:"api/mail",
                method:"POST",
                body: obj
            })
        }),
        updatePassword: build.mutation({
            query: (details) => ({
                url: "/api/user/updatePassword",
                method: "PUT",
                body: details
            }),
            invalidatesTags:["Gallery"]
        }),
    })
})

export const {useSendEmailMutation,useUpdatePasswordMutation} = mailApiSlice