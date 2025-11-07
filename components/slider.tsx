"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export type Slide = {
    title: string;
    description: string;
    highlight: string;
    image: string;
};

const fallbackSlides: Slide[] = [
    {
        title: "Apec Group: Hành trình dẫn đầu",
        description:
            "Tập trung chiến lược 2025 với ba trụ cột: số hóa vận hành, nâng cao trải nghiệm khách hàng và phát triển nhân sự cốt lõi.",
        highlight: "Chiến lược 2025",
        image: "/tuyendungbaove/sliderHero.png",
    },
    {
        title: "Nhịp điệu phát triển dự án",
        description:
            "Các dự án trọng điểm tại Huế, Quy Nhơn, Lạng Sơn và Bắc Ninh đang đạt 95% tiến độ, chuẩn bị nghiệm thu giai đoạn cuối.",
        highlight: "Tiến độ dự án",
        image: "/tuyendungbaove/BAOVECHUYENNGHIEP/1.png",
    },
    {
        title: "Chăm sóc cộng đồng Apec",
        description:
            "Khởi động chương trình LifeCare và học bổng Shine For Future cho toàn bộ nhân sự và đội ngũ kế cận.",
        highlight: "Phúc lợi nội bộ",
        image: "/tuyendungbaove/BAOVECHUYENNGHIEP/2.png",
    },
];

type SliderProps = {
    slides?: Slide[];
};

export default function Slider({ slides = fallbackSlides }: SliderProps) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        setCurrent(0);
    }, [slides.length]);

    useEffect(() => {
        if (slides.length <= 1) {
            return;
        }
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    if (slides.length === 0) {
        return null;
    }

    const next = () => setCurrent((current + 1) % slides.length);
    const prev = () =>
        setCurrent((current - 1 + slides.length) % slides.length);

    return (
        <div 
        style={{boxShadow: "0 0 10px 2px rgb(169, 169, 170)"}}
        className="relative flex flex-col sm:flex-row items-center justify-between rounded-3xl border border-slate-800 bg-gray-300 px-6 py-4 ">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left sm:w-2/3 md:mr-5">
                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start sm:flex-nowrap sm:gap-4">
                    <div className="rounded-full border border-teal-400 bg-teal-400 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-white">
                        {slides[current].highlight}
                    </div>
                    <div className="flex gap-1">
                        {slides.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 w-8 rounded-full transition sm:w-12 ${
                                    idx === current
                                        ? "bg-teal-400"
                                        : "bg-slate-700"
                                }`}
                            ></div>
                        ))}
                    </div>
                </div>

                <div className="mt-5 text-2xl font-semibold text-black/80 sm:text-3xl md:text-4xl">
                    {slides[current].title}
                </div>
                <div className="mt-3 max-w-3xl text-base text-white sm:text-lg font-semibold ">
                    {slides[current].description}
                </div>

                <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-3">
                    <button
                        onClick={prev}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-gray-500 text-white transition hover:border-blue-500"
                    >
                        <ChevronLeft size={22} />
                    </button>
                    <button
                        onClick={next}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-gray-500 text-white transition hover:border-blue-500"
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
// relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 p-6 sm:p-7 lg:p-8 flex flex-col sm:flex-row items-center gap-6
