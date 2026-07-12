"use client";

import { ArrowRight, Star, Users, BookOpen, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import NavLink from "@/components/NavLink";

const stats = [
  {
    value: "12K+",
    label: "Active Teachers",
  },
  {
    value: "340K+",
    label: "Students Enrolled",
  },
  {
    value: "4.9★",
    label: "Average Rating",
  },
];

const dashboardStats = [
  {
    value: "8,191",
    label: "Students",
    icon: Users,
  },
  {
    value: "3",
    label: "Active Courses",
    icon: BookOpen,
  },
  {
    value: "4.9★",
    label: "Rating",
    icon: Star,
  },
];

export default function LandingPage() {
  return (
    <section className="relative overflow-hidden bg-[#050816] text-white">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/10 blur-[180px]" />

        <div className="absolute left-20 top-40 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="absolute right-20 bottom-20 h-72 w-72 rounded-full bg-lime-400/10 blur-[120px]" />
      </div>

      <div className="container relative mx-auto px-6 py-16">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Side */}
          <div>
            {/* Logo */}
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full shadow-[0_0_30px_rgba(190,242,100,.6)]">
                <Image
                  src="/logo.png"
                  alt="Nibras Logo"
                  width={60}
                  height={60}
                />
              </div>

              <span className="text-3xl font-semibold">Nibras</span>
            </div>

            {/* Heading */}
            <h1 className="max-w-xl text-6xl font-extrabold lg:text-7xl">
              Teach the world.
              <br />
              <span className="text-lime-400">Track every step.</span>
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-xl text-xl leading-relaxed text-zinc-400">
              Nibras gives educators a premium platform to create, manage, and
              grow their courses with real-time analytics, student insights, and
              tools that scale with you.
            </p>

            {/* Actions */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="h-16 rounded-2xl bg-lime-400 px-8 text-lg font-semibold text-black hover:bg-lime-300"
              >
                <NavLink href="/login">Log In</NavLink>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-16 rounded-2xl border-zinc-700 bg-transparent px-8 text-lg text-white hover:bg-white/5"
              >
                <NavLink href="/signup">Sign Up</NavLink>
              </Button>
            </div>

            {/* Bottom Stats */}
            <div className="mt-16 grid grid-cols-3 border-t border-white/10 pt-10">
              {stats.map((item) => (
                <div key={item.label}>
                  <h3 className="text-5xl font-bold">{item.value}</h3>

                  <p className="mt-2 text-zinc-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="relative">
            <div className="rounded-[36px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              {/* Header */}
              <div className="mb-10 flex items-center justify-between">
                <h3 className="text-3xl font-semibold">Monthly Revenue</h3>

                <div className="rounded-full bg-lime-400/15 px-5 py-2 text-xl font-bold text-lime-400">
                  +24.8%
                </div>
              </div>

              {/* Fake Chart */}
              <div className="relative h-56 overflow-hidden">
                <svg viewBox="0 0 500 200" className="h-full w-full">
                  <path
                    d="M0 120 C80 100,120 80,200 75 C260 70,310 95,360 85 C420 70,450 55,500 40"
                    fill="none"
                    stroke="#d9ff38"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent" />
              </div>

              {/* Dashboard Cards */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                {dashboardStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center"
                  >
                    <h4 className="text-3xl font-bold">{item.value}</h4>

                    <p className="mt-1 text-zinc-400">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Notification */}
              <div className="mt-6 flex items-center justify-between rounded-3xl bg-lime-400 px-6 py-5 text-black">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-black/10 p-2">
                    <UserPlus size={18} />
                  </div>

                  <div>
                    <h4 className="font-bold">New enrollment!</h4>

                    <p className="text-sm opacity-80">
                      Alex joined Advanced React Dev
                    </p>
                  </div>
                </div>

                <span className="font-medium">now</span>
              </div>
            </div>

            {/* Outer Glow */}
            <div className="absolute inset-0 -z-10 rounded-full bg-lime-400/10 blur-[120px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
