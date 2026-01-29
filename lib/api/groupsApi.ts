import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuthHandling } from "./baseQuery"
import { Certificate, ApiResponse } from "./certificatesApi"

export interface Group {
  id: string
  name: string
  description: string
  certificates: Certificate[]
  isPublic: boolean
  shareToken: string
  createdAt: string
  updatedAt: string
  userId: string
  _count?: {
      certificates: number
  }
}

export interface CreateGroupRequest {
  name: string
  description: string
  certificateIds: string[]
  isPublic: boolean
}

export const groupsApi = createApi({
  reducerPath: "groupsApi",
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: ["Groups"],
  endpoints: (builder) => ({
    getGroups: builder.query<Group[], { search?: string }>({
      query: (params) => ({
        url: "/groups",
        params,
      }),
      transformResponse: (response: ApiResponse<Group[]>) => response.data,
      providesTags: ["Groups"],
    }),
    createGroup: builder.mutation<ApiResponse<Group>, CreateGroupRequest>({
      query: (body) => ({
        url: "/groups",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Groups"],
    }),
    updateGroup: builder.mutation<ApiResponse<Group>, { id: string; data: Partial<CreateGroupRequest> }>({
      query: ({ id, data }) => ({
        url: `/groups/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Groups", { type: "Groups", id }],
    }),
    getGroupById: builder.query<Group, string>({
      query: (id) => `/groups/${id}`,
      transformResponse: (response: ApiResponse<Group>) => response.data,
      providesTags: (result, error, id) => [{ type: "Groups", id }],
    }),
    deleteGroup: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/groups/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Groups"],
    }),
    addCertificatesToGroup: builder.mutation<ApiResponse<Group>, { groupId: string; certificateIds: string[] }>({
      query: ({ groupId, certificateIds }) => ({
        url: `/groups/${groupId}/certificates`,
        method: "POST",
        body: { certificateIds },
      }),
      invalidatesTags: (result, error, { groupId }) => [{ type: "Groups", id: groupId }],
    }),
    removeCertificateFromGroup: builder.mutation<ApiResponse<Group>, { groupId: string; certificateId: string }>({
      query: ({ groupId, certificateId }) => ({
        url: `/groups/${groupId}/certificates/${certificateId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { groupId }) => [{ type: "Groups", id: groupId }],
    }),
    getPublicGroup: builder.query<Group, string>({
      query: (id) => `/groups/public/${id}`,
      transformResponse: (response: ApiResponse<Group>) => response.data,
    }),
  }),
})

export const { 
  useGetGroupsQuery, 
  useCreateGroupMutation, 
  useGetGroupByIdQuery, 
  useDeleteGroupMutation,
  useAddCertificatesToGroupMutation,
  useRemoveCertificateFromGroupMutation,
  useUpdateGroupMutation,
  useGetPublicGroupQuery
} = groupsApi
