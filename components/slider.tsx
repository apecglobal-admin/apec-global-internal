"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useAnnouncementData } from "@/src/hooks/annoucementhook";
import { usePathname, useRouter } from "next/navigation";

export type Slide = {
    id: string;
    title: string;
    description: string;
    highlight: string; 
    image: string;
};

// const fallbackSlides: Slide[] = [
//     {
//         id: "1",
//         title: "Apec Group: Hành trình dẫn đầu",
//         description:
//             "Tập trung chiến lược 2025 với ba trụ cột: số hóa vận hành, nâng cao trải nghiệm khách hàng và phát triển nhân sự cốt lõi.",
//         highlight: "Chiến lược 2025",
//         image: "https://res.cloudinary.com/digowtlf1/image/upload/v1763437136/7d0fe5c1b51939476008_sie9fw.jpg",
//     },
//     {
//         id: "2",
//         title: "Nhịp điệu phát triển dự án",
//         description:
//             "Các dự án trọng điểm tại Huế, Quy Nhơn, Lạng Sơn và Bắc Ninh đang đạt 95% tiến độ, chuẩn bị nghiệm thu giai đoạn cuối.",
//         highlight: "Tiến độ dự án",
//         image: "https://res.cloudinary.com/digowtlf1/image/upload/v1763437759/2_tvc8pu.jpg",
//     },
//     {
//         id: "3",
//         title: "Chăm sóc cộng đồng Apec",
//         description:
//             "Khởi động chương trình LifeCare và học bổng Shine For Future cho toàn bộ nhân sự và đội ngũ kế cận.",
//         highlight: "Phúc lợi nội bộ",
//         image: "https://res.cloudinary.com/digowtlf1/image/upload/v1763437733/1_gbuefy.jpg",
//     },
// ];

type SliderProps = {
    slides?: any[]; // nhận raw API (mảng từ server)
};

export default function Slider({ slides = [] }: SliderProps) {
    const router = useRouter();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        setCurrent(0);
    }, [slides.length]);
    
    useEffect(() => {
        if (slides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length]);

    if (slides.length === 0) return null;

    const next = () => setCurrent((current + 1) % slides.length);
    const prev = () =>
        setCurrent((current - 1 + slides.length) % slides.length);

    const handleClick = (direct: string) => {
        if (!direct) {
            router.push("/#");
            window.location.href = "#";
            return;
        }        
    
        // Trim khoảng trắng
        let url = direct.trim();
    
        // Nếu thiếu http/https thì tự thêm http://
        if (!/^https?:\/\//i.test(url)) {
            url = "http://" + url;
        }
    
        // Kiểm tra URL có hợp lệ không
        try {
            new URL(url);
        } catch (e) {
            router.push("/#");
            window.location.href = "#";
            return;
        }
    
        // Mở tab mới
        window.open(url, "_blank", "noopener,noreferrer");
    };
    
    return (
        <div 
        style={{boxShadow: "inset 0 0 7px rgba(0, 0, 0, 0.5)"}}
        className="relative flex flex-col sm:flex-row items-center justify-between rounded-3xl bg-white px-6 py-4 inset-shadow-sm inset-shadow-black/50"
        onClick={() => handleClick(slides[current].redirect)}
        >

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left sm:w-2/3 md:mr-5">

                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start sm:flex-nowrap sm:gap-4">
                    <div 
                        className="rounded-full border border-black bg-blue-950 px-4 py-1 text-xs font-extrabold uppercase  text-white">
                        {slides[current].highlight}
                    </div>
                    <div className="flex gap-1">
                        {slides.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 w-8 rounded-full transition sm:w-12 ${
                                    idx === current
                                        ? "bg-blue-950"
                                        : "bg-gray-400"
                                }`}
                            ></div>
                        ))}
                    </div>
                </div>

                <div className="mt-5 text-2xl capitalize font-semibold text-blue-main sm:text-3xl md:text-4xl">
                    {slides[current].title}
                </div>
                <div className="mt-3 max-w-3xl text-base text-black/60 sm:text-lg font-bold ">
                    {slides[current].description}
                </div>

                <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prev();
                        }}
                        className="flex h-11 w-11 items-center justify-center rounded-full inset-shadow-sm inset-shadow-black/50 bg-blue-gradiant-main bg-gray-300 text-black transition hover:border-blue-500"
                    >
                        <ChevronLeft size={22} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            next();
                        }}
                        className="flex h-11 w-11 items-center justify-center rounded-full inset-shadow-sm inset-shadow-black/50 bg-blue-gradiant-main bg-gray-300 text-black transition hover:border-blue-500"
                    >
                        <ChevronRight size={22} />
                    </button>
                </div>
            </div>

            <div className="md:w-1/3 sm:w-1/3 w-3/4 sm:mt-0  mt-8  w-full rounded-lg overflow-hidden" style={{ height: "280px" }}>
                <Image
                    src={slides[current].image}
                    alt={slides[current].image}
                    width={0}
                    height={0}
                    className="w-full h-full  rounded-md object-fix"
                />
            </div>
        </div>
    );
}
