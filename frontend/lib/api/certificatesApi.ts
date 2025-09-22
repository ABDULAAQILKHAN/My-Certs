import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface Certificate {
  id: string
  title: string
  description: string
  imageUrl: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  skills: string[]
  isPublic: boolean
  shareToken: string
  createdAt: string
  updatedAt: string
}

export interface CreateCertificateRequest {
  title: string
  description: string
  image: File
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  skills: string[]
  isPublic: boolean
}

export const certificatesApi = createApi({
  reducerPath: "certificatesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/certificates",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Certificate"],
  endpoints: (builder) => ({
    getCertificates: builder.query<Certificate[], { search?: string }>({
      query: ({ search }) => ({
        url: search ? `?search=${encodeURIComponent(search)}` : "",
      }),
      providesTags: ["Certificate"],
    }),
    getCertificate: builder.query<Certificate, string>({
      query: (id) => `/${id}`,
      providesTags: ["Certificate"],
    }),
    getPublicCertificate: builder.query<Certificate, string>({
      query: (shareToken) => `/public/${shareToken}`,
    }),
    createCertificate: builder.mutation<Certificate, FormData>({
      query: (formData) => ({
        url: "",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Certificate"],
    }),
    updateCertificate: builder.mutation<Certificate, { id: string; data: Partial<Certificate> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Certificate"],
    }),
    deleteCertificate: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Certificate"],
    }),
  }),
})

export const {
  useGetCertificatesQuery,
  useGetCertificateQuery,
  useGetPublicCertificateQuery,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
} = certificatesApi
