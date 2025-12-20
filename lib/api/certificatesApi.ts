import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuthHandling } from "./baseQuery"

export interface Certificate {
  id: string
  title: string
  description: string
  image: string | null
  imagePath?: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  skills: string[]
  isPublic: boolean
  shareToken: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface CreateCertificateRequest {
  title: string
  description: string
  image: string // Base64 string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  imagePath?: string
  //skills: string[]
  isPublic: boolean
}

export interface UpdateCertificateRequest extends Partial<CreateCertificateRequest> {}

export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
  error?: string
  timestamp: string
}

export interface ApiResponseValidity<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
  error?: string
  timestamp: string
}

export const certificatesApi = createApi({
  reducerPath: "certificatesApi",
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: ["Certificate"],
  endpoints: (builder) => ({
    // Get all certificates for the authenticated user
    getCertificates: builder.query<Certificate[], { search?: string }>({
      query: ({ search } = {}) => ({
        url: "/certificate/list",
        method: "GET",
        //params: search ? { search } : undefined,
      }),
      transformResponse: (response: ApiResponse<Certificate[]>) => response.data,
      providesTags: ["Certificate"],
    }),

    // Get a single certificate by ID
    getCertificate: builder.query<Certificate, string>({
      query: (id) => ({
        url: `/certificate/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Certificate>) => response.data,
      providesTags: ["Certificate"],
    }),

    getCertificateValidity: builder.mutation<any, string>({
      query: (id) => ({
        url: `/certificate/check-validitity/${id}`,
        method: "POST",
      }),
      //providesTags: ["Certificate"],
    }),


    // Get public certificate by share token
    getPublicCertificate: builder.query<Certificate, string>({
      query: (shareToken) => ({
        url: `/certificate/public/${shareToken}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Certificate>) => response.data,
    }),

    // Create a new certificate
    createCertificate: builder.mutation<ApiResponse<Certificate>, CreateCertificateRequest>({
      query: (certificateData) => ({
        url: "/certificate",
        method: "POST",
        body: certificateData,
      }),
      //transformResponse: (response: ApiResponse<Certificate>) => response.data,
      invalidatesTags: ["Certificate"],
    }),

    // Update an existing certificate
    updateCertificate: builder.mutation<Certificate, { id: string; data: UpdateCertificateRequest }>({
      query: ({ id, data }) => ({
        url: `/certificate/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: ApiResponse<Certificate>) => response.data,
      invalidatesTags: ["Certificate"],
    }),

    // Delete a certificate
    deleteCertificate: builder.mutation<{ message: string }, string>({
      query: (credentialId) => ({
        url: `/certificate/${credentialId}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<{ message: string }>) => response.data,
      invalidatesTags: ["Certificate"],
    }),

    // Toggle certificate visibility (public/private)
    toggleCertificateVisibility: builder.mutation<Certificate, { id: string}>({
      query: ({ id }) => ({
        url: `/certificate/visibility/${id}`,
        method: "PATCH",
        //body: { isPublic },
      }),
      transformResponse: (response: ApiResponse<Certificate>) => response.data,
      invalidatesTags: ["Certificate"],
    }),

    // Generate new share token for certificate
    generateShareToken: builder.mutation<{ shareToken: string }, string>({
      query: (id) => ({
        url: `/certificate/${id}/share-token`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<{ shareToken: string }>) => response.data,
      invalidatesTags: ["Certificate"],
    }),
  }),
})

export const {
  useGetCertificatesQuery,
  useGetCertificateQuery,
  useGetPublicCertificateQuery,
  useGetCertificateValidityMutation,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
  useToggleCertificateVisibilityMutation,
  useGenerateShareTokenMutation,
} = certificatesApi
