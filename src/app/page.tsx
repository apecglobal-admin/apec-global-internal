"use client";
import Header from "@/components/header";
import Slider from "@/components/slider";
import AnnouncementSection from "@/components/announcement-section";
import LoginSection from "@/components/login-section";
import ProjectsSection from "@/components/projects-section";
import StatisticsSection from "@/components/statistics-section";
import PolicySection from "@/components/policy-section";
import EventSection from "@/components/event-section";
import ProgramSection from "@/components/program-section";
import AdditionalSection from "@/components/additional-section";
import Footer from "@/components/footer";

// import Tabs UI
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
const nav = [
    { value: "statistics", label: "Thống kê báo cáo" },
    { value: "policy", label: "Chính sách nội bộ" },
    { value: "event", label: "Sự kiện" },
    { value: "projects", label: "Danh mục dự án" },
    { value: "additional", label: "Các mục bổ sung" },
];
export default function Home() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Header />

            <main className="mx-auto w-full max-w-7xl px-4 py-10 space-y-10 sm:px-6 sm:py-12 sm:space-y-12 md:px-8 md:py-14 lg:px-8 lg:py-16 lg:space-y-16">
                <Slider />

                {/* Grid Announcement + Login */}
                <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                    {/* Announcement luôn hiển thị */}
                    <div className="order-2 lg:order-none">
                        <AnnouncementSection />
                    </div>

                    {/* Login: ẩn trên mobile, có thể thêm nút show nếu muốn */}
                    <div className="order-1 lg:order-none hidden lg:block">
                        <LoginSection />
                    </div>
                </div>

                {/* Tabs */}

                <Tabs defaultValue="statistics" className="mt-10 w-full">
                    <TabsList className="inline-flex flex-wrap justify-start w-full gap-2 bg-custom-blue-gradient rounded-2xl border border-slate-700 backdrop-blur-sm mb-8 p-3 h-auto">
                        {nav.map((tab, index) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="inline-flex items-center justify-center whitespace-nowrap min-w-[110px] sm:min-w-[140px] px-4 py-3 sm:px-5 sm:py-3.5 
    rounded-full 
    font-medium text-sm text-slate-400
    transition-all duration-200 
    bg-slate-800/50 border border-slate-700/50


    data-[state=active]:bg-gradient-to-br 
    data-[state=active]:from-blue-300/70 
    data-[state=active]:to-blue-900 
    data-[state=active]:text-white
    data-[state=active]:border-blue-600/50 
    data-[state=active]:shadow-lg 
    data-[state=active]:shadow-black/50

    hover:bg-slate-700/50 hover:text-slate-200 hover:border-slate-600"
                            >
                                <span
                                    className="
                    data-[state=active]:text-green-300
                "
                                >
                                    {tab.label}
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="space-y-6">
                        <TabsContent
                            value="statistics"
                            className="animate-in fade-in-50 duration-300 bg-active-blue-metallic p-1 sm:p-2 rounded-2xl "
                        >
                            <StatisticsSection />
                        </TabsContent>

                        <TabsContent
                            value="policy"
                            className="animate-in fade-in-50 duration-300 bg-active-blue-metallic p-1 sm:p-2 rounded-2xl "
                        >
                            <PolicySection />
                        </TabsContent>

                        <TabsContent
                            value="event"
                            className="animate-in fade-in-50 duration-300 bg-active-blue-metallic p-1 sm:p-2 rounded-2xl "
                        >
                            <EventSection />
                        </TabsContent>

                        <TabsContent
                            value="projects"
                            className="animate-in fade-in-50 duration-300 bg-active-blue-metallic p-1 sm:p-2 rounded-2xl "
                        >
                            <ProjectsSection />
                        </TabsContent>

                        <TabsContent
                            value="additional"
                            className="animate-in fade-in-50 duration-300 bg-active-blue-metallic p-1 sm:p-2 rounded-2xl "
                        >
                            <AdditionalSection />
                        </TabsContent>
                    </div>
                </Tabs>

                {/* Thi đua & khen thưởng */}
                <ProgramSection />
            </main>

            <Footer />
        </div>
    );
}
