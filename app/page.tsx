"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppSelector } from "@/lib/hooks"
import SiteHeader from "@/components/site-header"

export default function HomePage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <SiteHeader />

      {/* Hero */}
      <section className="container mx-auto grid items-center gap-10 px-6 pb-16 pt-8 md:grid-cols-2 md:gap-12 md:pt-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Secure • Shareable • Beautiful
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Organize, Share and Showcase your Certificates
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            My Certs helps you securely store, categorize and share your achievements with elegant, privacy‑aware links and previews.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <Button asChild size="lg">
                <Link href="/dashboard">Open Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/signup">Create your account</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">Sign in</Link>
                </Button>
              </>
            )}
            <Button asChild variant="ghost">
              <Link href="#features">Learn more</Link>
            </Button>
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><ShieldIcon className="h-4 w-4 text-primary" />Private by default</div>
            <div className="flex items-center gap-2"><ZapIcon className="h-4 w-4 text-primary" />Fast previews</div>
            <div className="flex items-center gap-2"><SparklesIcon className="h-4 w-4 text-primary" />Clean design</div>
          </div>
        </div>

        {/* Illustrative mock */}
        <div className="relative mx-auto w-full max-w-md rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary/15 flex items-center justify-center">
                <Image src="/quality.png" alt="logo" width={16} height={16} />
              </div>
              <div>
                <p className="text-sm font-medium">Certificate.pdf</p>
                <p className="text-xs text-muted-foreground">Uploaded just now</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">2.3 MB</div>
          </div>
          <div className="overflow-hidden rounded-lg border bg-background">
            <div className="aspect-[4/3] p-4">
             <Image src="/certificate image.png" alt="logo" width={400} height={300} />
              {/* <div className="grid h-full grid-rows-6 gap-2">
                <Skeleton className="row-span-1" />
                <Skeleton className="row-span-1 w-2/3" />
                <Skeleton className="row-span-3" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div> */}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">Share token enabled</div>
            <Button size="sm" variant="secondary">Preview</Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto scroll-mt-24 px-6 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything you need</h2>
          <p className="mt-3 text-muted-foreground">From upload to share, a streamlined flow that respects your privacy and time.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<UploadIcon className="h-5 w-5" />} title="Upload & Organize" desc="Drag‑and‑drop uploads, tags and quick search keep certificates tidy." />
          <FeatureCard icon={<LinkIcon className="h-5 w-5" />} title="Share with Control" desc="Generate private links with optional expiry and revoke anytime." />
          <FeatureCard icon={<EyeIcon className="h-5 w-5" />} title="Beautiful Previews" desc="Clean, responsive previews that look great on any device." />
          <FeatureCard icon={<LockIcon className="h-5 w-5" />} title="Secure by Design" desc="Built on modern auth and secure storage best practices." />
          <FeatureCard icon={<SparklesIcon className="h-5 w-5" />} title="Polished UI" desc="Theme‑aware components that match your light/dark preference." />
          <FeatureCard icon={<ZapIcon className="h-5 w-5" />} title="Fast & Reliable" desc="Optimized rendering and CDN‑friendly assets for snappy loads." />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container mx-auto grid gap-8 scroll-mt-24 px-6 py-12 md:grid-cols-3 md:py-16">
        <StepCard step="1" title="Create your account" desc="Sign up in seconds and set your profile preferences." />
        <StepCard step="2" title="Upload certificates" desc="Add files, set categories and generate shareable links." />
        <StepCard step="3" title="Share & showcase" desc="Send private links or add to your profile portfolio." />
      </section>

      {/* Call to action */}
      <section className="container mx-auto px-6 pb-16 pt-8">
        <div className="rounded-2xl border bg-card p-8 text-center shadow-sm md:p-12">
          <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready to take control of your certificates?</h3>
          <p className="mt-3 text-muted-foreground">Start free today. No credit card required.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {isAuthenticated ? (
              <Button asChild size="lg">
                <Link href="/dashboard">Open Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/signup">Get started free</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">Sign in</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Image src="/quality.png" alt="My Certs" width={18} height={18} />
            <span>© {new Date().getFullYear()} My Certs</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground">Login</Link>
            <Link href="/signup" className="hover:text-foreground">Signup</Link>
            <a href="#features" className="hover:text-foreground">Features</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="group rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

function StepCard({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-2 inline-flex h-7 items-center justify-center rounded-md bg-primary/10 px-2 text-xs font-medium text-primary">
        Step {step}
      </div>
      <h4 className="text-base font-semibold">{title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

// Minimal inline icons to avoid extra deps
function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.25c-.3 0-.6.06-.88.18L6.2 4.2a2.25 2.25 0 0 0-1.45 2.1V12c0 2.93 1.76 5.6 4.48 6.78l2.2.96c.36.16.78.16 1.14 0l2.2-.96A7.5 7.5 0 0 0 19.25 12V6.3c0-.92-.57-1.75-1.45-2.1l-4.92-1.83c-.28-.12-.58-.18-.88-.18Z" />
    </svg>
  )
}
function ZapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M11 2 3 14h7l-1 8 8-12h-7l1-8Z" />
    </svg>
  )
}
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M9 2.5 10.5 7 15 8.5 10.5 10 9 14.5 7.5 10 3 8.5 7.5 7 9 2.5Zm9 4 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3ZM14 13l.75 2.25L17 16l-2.25.75L14 19l-.75-2.25L11 16l2.25-.75L14 13Z" />
    </svg>
  )
}
function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 3v10l3.5-3.5 1.5 1.5L12 17l-5-5 1.5-1.5L11 13V3h1Z" />
      <path d="M4 19h16v2H4z" />
    </svg>
  )
}
function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3.9 12a4.1 4.1 0 0 1 4.1-4.1h3v2h-3a2.1 2.1 0 0 0 0 4.2h3v2h-3A4.1 4.1 0 0 1 3.9 12Zm12.1-4.1h-3v2h3a2.1 2.1 0 0 1 0 4.2h-3v2h3a4.1 4.1 0 0 0 0-8.2Z" />
    </svg>
  )
}
function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 5c-5.5 0-9 5-9 7s3.5 7 9 7 9-5 9-7-3.5-7-9-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" />
    </svg>
  )
}
function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17 9V7a5 5 0 1 0-10 0v2H5v12h14V9h-2ZM9 7a3 3 0 1 1 6 0v2H9V7Z" />
    </svg>
  )
}

