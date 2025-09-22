"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGetCertificateQuery } from "@/lib/api/mockCertificatesApi"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ShareModal } from "@/components/share-modal"
import { ArrowLeft, Share2, Download, Calendar, Building, Hash, Globe, Lock, Loader2 } from "lucide-react"

export default function PreviewPage() {
  const params = useParams()
  const router = useRouter()
  const [showShareModal, setShowShareModal] = useState(false)

  const { data: certificate, isLoading, error } = useGetCertificateQuery(params.id as string)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !certificate) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">Certificate not found</p>
          <button onClick={() => router.push("/dashboard")} className="mt-4 text-primary hover:text-primary/80">
            Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = certificate.imageUrl
    link.download = `${certificate.title}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Preview" }]

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>

            {certificate.isPublic && (
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Certificate Image */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <img
                src={certificate.imageUrl || "/placeholder.svg?height=600&width=800"}
                alt={certificate.title}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Certificate Details */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{certificate.title}</h1>
                <div className="flex items-center">
                  {certificate.isPublic ? (
                    <Globe className="h-5 w-5 text-green-500" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>

              {certificate.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-6">{certificate.description}</p>
              )}

              <div className="space-y-4">
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Issued by</p>
                    <p className="font-medium text-gray-900 dark:text-white">{certificate.issuer}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Issue Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(certificate.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {certificate.expiryDate && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Expiry Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(certificate.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {certificate.credentialId && (
                  <div className="flex items-center">
                    <Hash className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Credential ID</p>
                      <p className="font-medium text-gray-900 dark:text-white font-mono text-sm">
                        {certificate.credentialId}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {certificate.skills.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {certificate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certificate Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Certificate Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Created</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(certificate.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(certificate.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Visibility</span>
                  <span className="text-gray-900 dark:text-white">{certificate.isPublic ? "Public" : "Private"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && <ShareModal certificate={certificate} onClose={() => setShowShareModal(false)} />}
    </DashboardLayout>
  )
}
