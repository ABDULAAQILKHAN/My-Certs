"use client"

import { useParams } from "next/navigation"
import { useGetPublicGroupQuery } from "@/lib/api/groupsApi"
import { Loader2, Calendar, Layers, Award, Building } from "lucide-react"

export default function PublicGroupPage() {
  const params = useParams()
  const id = params.id as string
  
  const { data: group, isLoading, error } = useGetPublicGroupQuery(id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Layers className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Group Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">
            This group may be private or the link may be invalid.
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
        {/* Branding */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center text-primary">
            <Award className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">CertShare</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{group.name}</h1>
          {group.description && (
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{group.description}</p>
          )}
          
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <Calendar className="h-4 w-4 mr-1.5" />
              Created {new Date(group.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <Layers className="h-4 w-4 mr-1.5" />
              {group.certificates?.length || 0} Certificates
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {group.certificates?.map((cert) => (
            <div 
              key={cert.id} 
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image */}
              <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
                {cert.image ? (
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Award className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                  {cert.title}
                </h3>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <Building className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{cert.issuer}</span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-md">
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </span>
                  
                  {cert.credentialId && (
                    <a 
                      href={`/public/${cert.credentialId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center"
                    >
                      View Details
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!group.certificates || group.certificates.length === 0) && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No certificates in this collection yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
