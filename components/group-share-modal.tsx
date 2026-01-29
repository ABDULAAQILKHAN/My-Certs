"use client"

import { useState } from "react"
import type { Group } from "@/lib/api/groupsApi"
import { X, Copy, Check, Facebook, Twitter, Linkedin, Mail } from "lucide-react"

interface GroupShareModalProps {
  group: Group
  onClose: () => void
}

export function GroupShareModal({ group, onClose }: GroupShareModalProps) {
  const [copied, setCopied] = useState(false)

  // Use the new public group route
  const shareUrl = `${window.location.origin}/public/groups/${group.id}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out my ${group.name} certificate collection!`)}`,
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "bg-blue-700 hover:bg-blue-800",
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(`${group.name} Certificate Group`)}&body=${encodeURIComponent(`Check out my certificate collection: ${shareUrl}`)}`,
      color: "bg-gray-600 hover:bg-gray-700",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share Group</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Share your <strong>{group.name}</strong> collection with others
          </p>

          {/* Copy Link */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Share Link</label>
            <div className="flex">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary/90 transition-colors flex items-center"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            {copied && <p className="text-sm text-green-600 dark:text-green-400 mt-1">Link copied to clipboard!</p>}
          </div>

          {/* Social Share */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Share on Social Media
            </label>
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => {
                const Icon = option.icon
                return (
                  <a
                    key={option.name}
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${option.color} text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{option.name}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
