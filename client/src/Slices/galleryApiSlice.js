import apiSlice from "../app/apiSlice"

const galleryApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getGallery: build.query({
            query: () => ({
                url: '/api/watch'
            }),
            providesTags:["Gallery"]
        }),
        addToFavorite: build.mutation({
            query: (details) => ({
                url: "/api/user",
                method: "PUT",
                body: details
            }),
            invalidatesTags:["Gallery"]
        }),
        getFavorite: build.query({
            query: () => ({
                url: '/api/user/favorite'
            }),
            providesTags:["Gallery"]
        }),
        addToGallery: build.mutation({
            query: (details) => ({
                url: "/api/watch",
                method: "POST",
                body: details
            }),
            invalidatesTags:["Gallery"]
        }),
        updateWatch: build.mutation({
            query: (details) => ({
                url: "/api/watch",
                method: "PUT",
                body: details
            }),
            invalidatesTags:["Gallery"]
        }),
        deleteFromGallery: build.mutation({
            query: (id) => ({
                url: "/api/watch/"+id,
                method: "DELETE",
            }),
            invalidatesTags:["Gallery"]
        }),
        getWatch: build.mutation({
            query: (id) => ({
                url: "/api/watch/"+id,
                method: "GET",
            }),
            invalidatesTags:["Gallery"]
        })
    }),
})
export const { useGetFavoriteQuery,useGetGalleryQuery,useAddToFavoriteMutation,useDeleteFromGalleryMutation,useAddToGalleryMutation,useUpdateWatchMutation,useGetWatchMutation } = galleryApiSlice