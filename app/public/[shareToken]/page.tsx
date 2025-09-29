"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useGetPublicCertificateQuery } from "@/lib/api/certificatesApi"
import { Calendar, Building, Hash, Award, Loader2 } from "lucide-react"

export default function PublicCertificatePage() {
  const params = useParams()
  const credentialId = params.shareToken
  const [certificate, setCertificate] = useState<any>(null);
  const { data, isLoading, error } = useGetPublicCertificateQuery(credentialId as string,{
    skip: !credentialId,
    refetchOnMountOrArgChange: true,
  })
  useEffect(() => {
    if (data) {
      setCertificate(data);
    }
  }, [data]);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Certificate Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">
            This certificate may be private or the link may be invalid.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Abstract Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 via-blue-500/20 to-indigo-600/20 dark:from-sky-600/10 dark:via-blue-700/10 dark:to-indigo-800/10"></div>
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-sky-300/30 dark:bg-sky-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-300/30 dark:bg-blue-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Award className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Certs</h1>
          <p className="text-gray-600 dark:text-gray-400">Professional Certificate Verification</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Certificate Image */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
              <img
                src={certificate.image || "/placeholder.svg?height=600&width=800"}
                alt={certificate.title}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Certificate Details */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{certificate.title}</h2>

              {certificate.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-6">{certificate.description}</p>
              )}

              <div className="space-y-4">
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Issued by</p>
                    <p className="font-medium text-gray-900 dark:text-white">{certificate.issuer}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Issue Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(certificate.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {certificate.expiryDate && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
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
                    <Hash className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Credential ID</p>
                      <p className="font-medium text-gray-900 dark:text-white font-mono text-sm break-all">
                        {certificate.credentialId}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {/* {certificate.skills.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
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
            )} */}

            {/* Verification Badge */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Verified Certificate</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This certificate has been verified and is authentic.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by <a href="https://solutions-with-aaqil.vercel.app/" target="_" className="font-semibold text-primary underline hover:opacity-30">Solutions with AAQIL</a>
          </p>
        </div>
      </div>
    </div>
  )
}
