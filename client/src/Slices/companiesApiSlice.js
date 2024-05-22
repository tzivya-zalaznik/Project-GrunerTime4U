import apiSlice from "../app/apiSlice"

const companiesApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getCompanies: build.query({
            query: () => ({
                url: '/api/company'
            }),
            providesTags:["Company"]
        }),
        addToCompanies: build.mutation({
            query: (details) => ({
                url: "/api/company",
                method: "POST",
                body: details
            }),
            invalidatesTags:["Company"]
        }),
        deleteFromCompanies: build.mutation({
            query: (id) => ({
                url: "/api/company/"+id,
                method: "DELETE",
            }),
            invalidatesTags:["Company"]
        }),
        updateCompany: build.mutation({
            query: (details) => ({
                url: "/api/company",
                method: "PUT",
                body: details
            }),
            invalidatesTags:["Company"]
        })
    }),
})
export const { useAddToCompaniesMutation,useDeleteFromCompaniesMutation,useGetCompaniesQuery,useUpdateCompanyMutation } = companiesApiSlice