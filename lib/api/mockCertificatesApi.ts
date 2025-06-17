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
  userId: string
}

// Dummy certificates data
const dummyCertificates: Certificate[] = [
  {
    id: "1",
    title: "AWS Certified Solutions Architect",
    description: "Professional level certification for designing distributed systems on AWS",
    imageUrl: "/placeholder.svg?height=400&width=600&text=AWS+Solutions+Architect",
    issuer: "Amazon Web Services",
    issueDate: "2024-01-15",
    expiryDate: "2027-01-15",
    credentialId: "AWS-SAA-C03-123456",
    skills: ["AWS", "Cloud Architecture", "EC2", "S3", "Lambda"],
    isPublic: true,
    shareToken: "aws-cert-share-token-123",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    userId: "demo",
  },
  {
    id: "2",
    title: "Google Cloud Professional Developer",
    description: "Professional certification for developing applications on Google Cloud Platform",
    imageUrl: "/placeholder.svg?height=400&width=600&text=GCP+Developer",
    issuer: "Google Cloud",
    issueDate: "2023-11-20",
    expiryDate: "2025-11-20",
    credentialId: "GCP-PCD-789012",
    skills: ["Google Cloud", "Kubernetes", "App Engine", "Cloud Functions"],
    isPublic: true,
    shareToken: "gcp-cert-share-token-456",
    createdAt: "2023-11-20T14:30:00Z",
    updatedAt: "2023-11-20T14:30:00Z",
    userId: "demo",
  },
  {
    id: "3",
    title: "Microsoft Azure Fundamentals",
    description: "Foundational knowledge of cloud services and Microsoft Azure",
    imageUrl: "/placeholder.svg?height=400&width=600&text=Azure+Fundamentals",
    issuer: "Microsoft",
    issueDate: "2023-09-10",
    credentialId: "AZ-900-345678",
    skills: ["Azure", "Cloud Computing", "Virtual Machines", "Storage"],
    isPublic: false,
    shareToken: "azure-cert-share-token-789",
    createdAt: "2023-09-10T09:15:00Z",
    updatedAt: "2023-09-10T09:15:00Z",
    userId: "demo",
  },
  {
    id: "4",
    title: "React Developer Certification",
    description: "Advanced React development skills and best practices",
    imageUrl: "/placeholder.svg?height=400&width=600&text=React+Developer",
    issuer: "Meta",
    issueDate: "2024-02-28",
    credentialId: "REACT-ADV-901234",
    skills: ["React", "JavaScript", "TypeScript", "Redux", "Next.js"],
    isPublic: true,
    shareToken: "react-cert-share-token-012",
    createdAt: "2024-02-28T16:45:00Z",
    updatedAt: "2024-02-28T16:45:00Z",
    userId: "demo",
  },
  {
    id: "5",
    title: "Kubernetes Administrator",
    description: "Certified Kubernetes Administrator (CKA) certification",
    imageUrl: "/placeholder.svg?height=400&width=600&text=Kubernetes+Admin",
    issuer: "Cloud Native Computing Foundation",
    issueDate: "2023-12-05",
    expiryDate: "2026-12-05",
    credentialId: "CKA-567890",
    skills: ["Kubernetes", "Docker", "Container Orchestration", "DevOps"],
    isPublic: true,
    shareToken: "k8s-cert-share-token-345",
    createdAt: "2023-12-05T11:20:00Z",
    updatedAt: "2023-12-05T11:20:00Z",
    userId: "demo",
  },
  {
    id: "6",
    title: "Cybersecurity Specialist",
    description: "CompTIA Security+ certification for cybersecurity fundamentals",
    imageUrl: "/placeholder.svg?height=400&width=600&text=Security%2B",
    issuer: "CompTIA",
    issueDate: "2023-08-15",
    expiryDate: "2026-08-15",
    credentialId: "SEC-PLUS-678901",
    skills: ["Cybersecurity", "Network Security", "Risk Management", "Compliance"],
    isPublic: false,
    shareToken: "security-cert-share-token-678",
    createdAt: "2023-08-15T13:10:00Z",
    updatedAt: "2023-08-15T13:10:00Z",
    userId: "demo",
  },
]

const getStoredCertificates = (): Certificate[] => {
  const certs = localStorage.getItem("mycerts_certificates")
  if (!certs) {
    // Initialize with dummy data
    localStorage.setItem("mycerts_certificates", JSON.stringify(dummyCertificates))
    return dummyCertificates
  }
  return JSON.parse(certs)
}

const storeCertificates = (certificates: Certificate[]) => {
  localStorage.setItem("mycerts_certificates", JSON.stringify(certificates))
}

const getCurrentUserId = (): string => {
  const user = localStorage.getItem("mycerts_current_user")
  return user ? JSON.parse(user).id : "demo"
}

export const mockCertificatesApi = createApi({
  reducerPath: "certificatesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/certificates",
  }),
  tagTypes: ["Certificate"],
  endpoints: (builder) => ({
    getCertificates: builder.query<Certificate[], { search?: string }>({
      queryFn: async ({ search }) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const certificates = getStoredCertificates()
        const userId = getCurrentUserId()

        let userCertificates = certificates.filter((cert) => cert.userId === userId || cert.userId === "demo")

        if (search) {
          userCertificates = userCertificates.filter(
            (cert) =>
              cert.title.toLowerCase().includes(search.toLowerCase()) ||
              cert.issuer.toLowerCase().includes(search.toLowerCase()) ||
              cert.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase())),
          )
        }

        return { data: userCertificates }
      },
      providesTags: ["Certificate"],
    }),
    getCertificate: builder.query<Certificate, string>({
      queryFn: async (id) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        const certificates = getStoredCertificates()
        const certificate = certificates.find((cert) => cert.id === id)

        if (!certificate) {
          return { error: { status: 404, data: { message: "Certificate not found" } } }
        }

        return { data: certificate }
      },
      providesTags: ["Certificate"],
    }),
    getPublicCertificate: builder.query<Certificate, string>({
      queryFn: async (shareToken) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        const certificates = getStoredCertificates()
        const certificate = certificates.find((cert) => cert.shareToken === shareToken && cert.isPublic)

        if (!certificate) {
          return { error: { status: 404, data: { message: "Certificate not found or not public" } } }
        }

        return { data: certificate }
      },
    }),
    createCertificate: builder.mutation<Certificate, FormData>({
      queryFn: async (formData) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const certificates = getStoredCertificates()
        const userId = getCurrentUserId()

        // Extract form data
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const issuer = formData.get("issuer") as string
        const issueDate = formData.get("issueDate") as string
        const expiryDate = formData.get("expiryDate") as string
        const credentialId = formData.get("credentialId") as string
        const isPublic = formData.get("isPublic") === "true"
        const skills = JSON.parse((formData.get("skills") as string) || "[]")

        // For demo purposes, we'll use a placeholder image
        const imageUrl = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(title)}`

        const newCertificate: Certificate = {
          id: Date.now().toString(),
          title,
          description,
          imageUrl,
          issuer,
          issueDate,
          expiryDate: expiryDate || undefined,
          credentialId: credentialId || undefined,
          skills,
          isPublic,
          shareToken: `share-${Date.now()}-${Math.random().toString(36).substring(2)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId,
        }

        certificates.push(newCertificate)
        storeCertificates(certificates)

        return { data: newCertificate }
      },
      invalidatesTags: ["Certificate"],
    }),
    updateCertificate: builder.mutation<Certificate, { id: string; data: Partial<Certificate> }>({
      queryFn: async ({ id, data }) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const certificates = getStoredCertificates()
        const index = certificates.findIndex((cert) => cert.id === id)

        if (index === -1) {
          return { error: { status: 404, data: { message: "Certificate not found" } } }
        }

        certificates[index] = {
          ...certificates[index],
          ...data,
          updatedAt: new Date().toISOString(),
        }

        storeCertificates(certificates)

        return { data: certificates[index] }
      },
      invalidatesTags: ["Certificate"],
    }),
    deleteCertificate: builder.mutation<void, string>({
      queryFn: async (id) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const certificates = getStoredCertificates()
        const filteredCertificates = certificates.filter((cert) => cert.id !== id)

        storeCertificates(filteredCertificates)

        return { data: undefined }
      },
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
} = mockCertificatesApi
