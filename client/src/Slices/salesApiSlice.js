import apiSlice from "../app/apiSlice"

const galleryApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getSales: build.query({
            query: () => ({
                url: '/api/purchase'
            }),
            providesTags:["Sales"]
        }),
        addToSales: build.mutation({
            query: (details) => ({
                url: "/api/purchase",
                method: "POST",
                body: details
            }),
            invalidatesTags:["Sales"]
        }),
        deleteFromSales: build.mutation({
            query: (id) => ({
                url: "/api/purchase/"+id,
                method: "DELETE",
                // body: details
            }),
            invalidatesTags:["Sales"]
        })
    }),
})
export const { useGetSalesQuery,useAddToSalesMutation,useDeleteFromSalesMutation } = galleryApiSlice