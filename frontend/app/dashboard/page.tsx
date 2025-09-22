"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useGetCertificatesQuery } from "@/lib/api/mockCertificatesApi"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CertificateCard } from "@/components/certificate-card"
import { Search, Plus, Loader2 } from "lucide-react"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const {
    data: certificates,
    isLoading,
    error,
  } = useGetCertificatesQuery({
    search: searchQuery,
  })

  const breadcrumbs = [{ label: "Dashboard" }]

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage and share your professional certificates</p>
        </div>

        <button
          onClick={() => router.push("/upload")}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors backdrop-blur-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Certificate
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300/50 dark:border-gray-600/50 rounded-md leading-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Certificates Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">Failed to load certificates</p>
        </div>
      ) : certificates && certificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {certificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              onClick={() => router.push(`/preview/${certificate.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No certificates found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery ? "Try adjusting your search terms." : "Get started by uploading your first certificate."}
          </p>
          {!searchQuery && (
            <div className="mt-6">
              <button
                onClick={() => router.push("/upload")}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors backdrop-blur-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Certificate
              </button>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
