"use client"
import Header from "@/components/header"
import Slider from "@/components/slider"
import AnnouncementSection from "@/components/announcement-section"
import LoginSection from "@/components/login-section"
import ProjectsSection from "@/components/projects-section"
import StatisticsSection from "@/components/statistics-section"
import PolicySection from "@/components/policy-section"
import EventSection from "@/components/event-section"
import ProgramSection from "@/components/program-section"
import AdditionalSection from "@/components/additional-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-10 space-y-10 sm:px-6 sm:py-12 sm:space-y-12 lg:px-8 lg:py-16 lg:space-y-16">
        <Slider />

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="order-2 lg:order-none">
            <AnnouncementSection />
          </div>
          <div className="order-1 lg:order-none">
            <LoginSection />
          </div>
        </div>

        <StatisticsSection />

        <div className="grid gap-8 lg:grid-cols-2">
          <PolicySection />
          <EventSection />
        </div>

        <ProgramSection />

        <ProjectsSection />

        <AdditionalSection />
      </main>

      <Footer />
    </div>
  )
}
