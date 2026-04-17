"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/lib/hooks"
import SiteHeader from "@/components/site-header"

/* ────────────────────────────────────────
   Intersection-observer hook for scroll reveals
   ──────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return { ref, visible }
}

/* ────────────────────────────────────────
   Home page
   ──────────────────────────────────────── */
export default function HomePage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const features = useReveal()
  const howItWorks = useReveal()
  const cta = useReveal()

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* ── Animated background blobs ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] bg-primary/[0.08] blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] bg-primary/[0.06] blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/3 h-[300px] w-[300px] bg-accent/[0.07] blur-3xl animate-blob animation-delay-4000" />
      </div>

      <SiteHeader />

      {/* ═══════════════════  HERO  ═══════════════════ */}
      <section className="container mx-auto grid items-center gap-12 px-6 pb-20 pt-12 md:grid-cols-2 md:pt-20 lg:gap-16">
        {/* ── Left copy ── */}
        <div className="animate-slide-in-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-xs font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Secure · Shareable · Beautiful
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Organize, Share &amp;&nbsp;
            <span className="bg-gradient-to-r from-primary via-sky-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              Showcase
            </span>{" "}
            your Certificates
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            My&nbsp;Certs helps you securely upload, group and share your achievements with elegant,
            privacy-aware links – all from one dashboard.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <Button asChild size="lg" className="animate-pulse-glow">
                <Link href="/dashboard">Open Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="animate-pulse-glow">
                  <a href="https://solutions-with-aaqil.vercel.app/signup?from=mycerts">Create your account</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">Sign in</Link>
                </Button>
              </>
            )}
            <Button asChild variant="ghost" className="group">
              <Link href="#features">
                Learn more
                <ChevronDownIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <Badge icon={<ShieldIcon className="h-4 w-4 text-primary" />} text="Private by default" />
            <Badge icon={<ZapIcon className="h-4 w-4 text-primary" />} text="Fast previews" />
            <Badge icon={<SparklesIcon className="h-4 w-4 text-primary" />} text="Clean design" />
          </div>
        </div>

        {/* ── Right – interactive hero card ── */}
        <div className="animate-slide-in-right animation-delay-300">
          <div className="relative mx-auto w-full max-w-md">
            {/* Glow behind the card */}
            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-cyan-400/10 blur-xl opacity-60" />
            <div className="relative rounded-2xl border border-white/10 bg-card/80 p-5 shadow-xl backdrop-blur-xl ring-1 ring-white/5 animate-float">
              {/* Card header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                    <Image src="/quality.png" alt="logo" width={18} height={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Certificate.pdf</p>
                    <p className="text-[11px] text-muted-foreground">Uploaded just now</p>
                  </div>
                </div>
                <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-[11px] font-medium text-green-500">
                  Public
                </span>
              </div>

              {/* Certificate image */}
              <div className="overflow-hidden rounded-xl border bg-background/60">
                <div className="aspect-[4/3] p-3">
                  <Image
                    src="/certificate image.png"
                    alt="sample certificate"
                    width={400}
                    height={300}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
              </div>

              {/* Card footer */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <LinkIcon className="h-3.5 w-3.5" />
                  Share token enabled
                </div>
                <Button size="sm" variant="secondary" className="text-xs">
                  Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════  FEATURES  ═══════════════════ */}
      <section
        id="features"
        ref={features.ref}
        className="container mx-auto scroll-mt-24 px-6 py-16 md:py-24"
      >
        <div className={`mx-auto max-w-2xl text-center transition-all duration-700 ${features.visible ? "animate-fade-in-up" : "opacity-0 translate-y-8"}`}>
          <span className="inline-block rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1 text-xs font-medium text-primary mb-4">
            Features
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Everything you need
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            From single uploads to grouped collections – a streamlined flow that respects your privacy.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <UploadIcon className="h-5 w-5" />,
              title: "Single Certificate Upload",
              desc: "Upload individual certificates with rich metadata — title, issuer, dates, credential ID — all in a clean drag‑and‑drop form.",
              delay: 0,
            },
            {
              icon: <LayersIcon className="h-5 w-5" />,
              title: "Group Certificates",
              desc: "Organize related certificates into named groups. Bundle your cloud, design or dev certs together for easy management.",
              delay: 150,
            },
            {
              icon: <ShareIcon className="h-5 w-5" />,
              title: "Share Certificates & Groups",
              desc: "Generate shareable links for individuals certs or entire groups. Share on LinkedIn, Twitter, Facebook or via email.",
              delay: 300,
            },
            {
              icon: <ToggleIcon className="h-5 w-5" />,
              title: "Public / Private Toggles",
              desc: "Each certificate and group has a public or private toggle. Keep work private or make it visible to the world — you choose.",
              delay: 450,
            },
            {
              icon: <EyeIcon className="h-5 w-5" />,
              title: "Beautiful Previews",
              desc: "Clean, responsive certificate previews that look stunning on any screen size — desktop, tablet or mobile.",
              delay: 600,
            },
            {
              icon: <LockIcon className="h-5 w-5" />,
              title: "Secure by Design",
              desc: "Built on modern auth and secure storage best practices. Your certificates are safe and only you control access.",
              delay: 750,
            },
          ].map((f, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl border border-transparent bg-card/60 p-6 backdrop-blur-sm transition-all duration-500
                hover:border-primary/20 hover:bg-card hover:shadow-lg hover:shadow-primary/[0.04] hover:-translate-y-1
                ${features.visible ? "animate-fade-in-up" : "opacity-0 translate-y-8"}`}
              style={{ animationDelay: `${f.delay + 200}ms` }}
            >
              {/* hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════  HOW IT WORKS  ═══════════════════ */}
      <section
        id="how-it-works"
        ref={howItWorks.ref}
        className="container mx-auto scroll-mt-24 px-6 py-16 md:py-24"
      >
        <div className={`mx-auto max-w-2xl text-center transition-all duration-700 ${howItWorks.visible ? "animate-fade-in-up" : "opacity-0 translate-y-8"}`}>
          <span className="inline-block rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1 text-xs font-medium text-primary mb-4">
            How it works
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Three simple steps</h2>
          <p className="mt-4 text-muted-foreground">Get started in under a minute.</p>
        </div>

        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          {/* connector line (desktop) */}
          <div className="pointer-events-none absolute inset-x-0 top-[54px] hidden h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent md:block" />

          {[
            { step: "1", title: "Create your account", desc: "Sign up in seconds, set your profile and theme preferences." },
            { step: "2", title: "Upload & organize", desc: "Add certificates individually or group them into curated collections." },
            { step: "3", title: "Share & showcase", desc: "Toggle public visibility, generate links and share on social media." },
          ].map((s, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl border bg-card/60 p-6 backdrop-blur-sm text-center transition-all duration-500
                hover:border-primary/20 hover:shadow-lg hover:-translate-y-1
                ${howItWorks.visible ? "animate-fade-in-up" : "opacity-0 translate-y-8"}`}
              style={{ animationDelay: `${i * 200 + 200}ms` }}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold shadow-md shadow-primary/20 transition-transform group-hover:scale-110">
                {s.step}
              </div>
              <h4 className="text-base font-semibold">{s.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════  CTA  ═══════════════════ */}
      <section ref={cta.ref} className="container mx-auto px-6 pb-20 pt-4">
        <div
          className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/[0.06] via-card to-card p-10 text-center shadow-sm md:p-16 transition-all duration-700
            ${cta.visible ? "animate-fade-in-up" : "opacity-0 translate-y-8"}`}
        >
          {/* decorative circles */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-400/10 blur-2xl" />

          <div className="relative">
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Ready to take control of your certificates?
            </h3>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Start free today. Upload, organize and share — no credit card required.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {isAuthenticated ? (
                <Button asChild size="lg" className="animate-pulse-glow">
                  <Link href="/dashboard">Open Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="animate-pulse-glow">
                    <a href="https://solutions-with-aaqil.vercel.app/signup?from=mycerts">Get started free</a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/login">Sign in</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════  FOOTER  ═══════════════════ */}
      <footer className="border-t bg-card/40 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-10">
          <div className="grid gap-8 sm:grid-cols-3">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2">
                <Image src="/quality.png" alt="My Certs" width={22} height={22} />
                <span className="text-base font-semibold">My Certs</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
                Securely store, organize and share your certificates with beautiful, privacy-aware links.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a></li>
                <li><Link href="/login" className="hover:text-foreground transition-colors">Login</Link></li>
                <li><a href="https://solutions-with-aaqil.vercel.app/signup?from=mycerts" className="hover:text-foreground transition-colors">Signup</a></li>
              </ul>
            </div>

            {/* Created by */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Created by</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This project was created under{" "}
                <a
                  href="https://solutions-with-aaqil.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Solutions with Aaqil
                </a>{" "}
                by{" "}
                <a
                  href="https://aaqilcodes.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Aaqil Khan
                </a>
                .
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} My Certs. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a
                href="https://solutions-with-aaqil.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Solutions with Aaqil
              </a>
              <span className="text-border">·</span>
              <a
                href="https://aaqilcodes.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                aaqilcodes
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ────────────────────────────────────────
   Small helper components
   ──────────────────────────────────────── */
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-3 py-1.5 text-xs backdrop-blur-sm">
      {icon}
      {text}
    </div>
  )
}

/* ────────────────────────────────────────
   Inline SVG icons (no extra deps)
   ──────────────────────────────────────── */
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

function ShareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function ToggleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="1" y="5" width="22" height="14" rx="7" ry="7" />
      <circle cx="16" cy="12" r="3" />
    </svg>
  )
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}
