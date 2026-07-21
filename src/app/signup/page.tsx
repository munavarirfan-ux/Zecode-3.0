"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

const fieldClass = cn(
  "h-11 w-full rounded-[12px] border border-[rgba(15,23,42,0.08)] bg-white/90 px-4 text-[14px] text-text outline-none",
  "placeholder:text-muted/60 focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-rgb)/0.25)] focus-visible:border-transparent",
  "dark:border-white/[0.08] dark:bg-white/[0.04]",
  "transition-all duration-[180ms] ease-out",
);

const primaryBtnClass = cn(
  "relative flex h-11 w-full items-center justify-center rounded-[12px] bg-accent text-[14px] font-semibold text-white",
  "transition-all duration-[180ms] ease-out",
  "hover:bg-accent-hover hover:shadow-[0_4px_16px_rgb(var(--accent-rgb)/0.3)]",
  "disabled:cursor-not-allowed disabled:opacity-70",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-rgb)/0.4)] focus-visible:ring-offset-2",
);

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 700);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent text-[13px] font-bold text-white shadow-[0_2px_8px_rgb(var(--accent-rgb)/0.25)]">
              Ze
            </div>
            <span className="text-[1.1rem] font-semibold tracking-[-0.02em] text-white">Ze[hub]</span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-[20px] border border-[rgba(15,23,42,0.06)] bg-white/[0.97] p-8 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12),0_2px_6px_rgba(15,23,42,0.04)] backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#141416]/[0.97] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]">
          <h1 className="text-center text-[1.375rem] font-semibold tracking-[-0.02em] text-text">
            Create your workspace
          </h1>
          <p className="mt-1.5 text-center text-[13px] text-text-secondary/80">
            Get started with Ze[hub].
          </p>

          <div className="mt-7">
            <GoogleButton />
            <Divider />
          </div>

          <form onSubmit={handleSignup} className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-text">Full name</label>
              <input
                type="text"
                className={fieldClass}
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-text">Work email</label>
              <input
                type="email"
                className={fieldClass}
                placeholder="Enter your work email"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-text">Company name</label>
              <input
                type="text"
                className={fieldClass}
                placeholder="Enter company name"
                autoComplete="organization"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-text">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={cn(fieldClass, "pr-10")}
                  placeholder="Create password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/60 hover:text-text transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" className={primaryBtnClass} disabled={loading}>
              {loading ? "Creating workspace..." : "Create Workspace"}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-text-secondary/80">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-accent hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="mt-4 text-center text-[11px] text-white/60">
          Demo access · credentials not required
        </p>
      </div>
    </div>
  );
}

function GoogleButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => { setLoading(true); setTimeout(() => router.push("/dashboard"), 600); }}
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2.5 rounded-[12px] border border-[rgba(15,23,42,0.1)] bg-white text-[14px] font-medium text-text",
        "transition-all duration-[180ms] ease-out",
        "hover:bg-[rgba(15,23,42,0.02)] hover:border-[rgba(15,23,42,0.14)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.06)]",
        "disabled:cursor-not-allowed disabled:opacity-70",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-rgb)/0.25)] focus-visible:ring-offset-2",
        "dark:border-white/[0.1] dark:bg-white/[0.04] dark:hover:bg-white/[0.06]",
      )}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
      </svg>
      {loading ? "Signing in..." : "Continue with Google"}
    </button>
  );
}

function Divider() {
  return (
    <div className="mt-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-[rgba(15,23,42,0.07)] dark:bg-white/[0.06]" />
      <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted/60">or</span>
      <div className="h-px flex-1 bg-[rgba(15,23,42,0.07)] dark:bg-white/[0.06]" />
    </div>
  );
}

function AuthBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/auth-bg.png')" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
    </>
  );
}
