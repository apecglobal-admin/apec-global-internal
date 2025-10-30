"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export type Slide = {
  title: string
  description: string
  highlight: string
}

const fallbackSlides: Slide[] = [
  {
    title: "Apec Group: Hành trình dẫn đầu",
    description: "Tập trung chiến lược 2025 với ba trụ cột: số hóa vận hành, nâng cao trải nghiệm khách hàng và phát triển nhân sự cốt lõi.",
    highlight: "Chiến lược 2025",
  },
  {
    title: "Nhịp điệu phát triển dự án",
    description: "Các dự án trọng điểm tại Huế, Quy Nhơn, Lạng Sơn và Bắc Ninh đang đạt 95% tiến độ, chuẩn bị nghiệm thu giai đoạn cuối.",
    highlight: "Tiến độ dự án",
  },
  {
    title: "Chăm sóc cộng đồng Apec",
    description: "Khởi động chương trình LifeCare và học bổng Shine For Future cho toàn bộ nhân sự và đội ngũ kế cận.",
    highlight: "Phúc lợi nội bộ",
  },
]

type SliderProps = {
  slides?: Slide[]
}

export default function Slider({ slides = fallbackSlides }: SliderProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    setCurrent(0)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) {
      return
    }
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (slides.length === 0) {
    return null
  }

  const next = () => setCurrent((current + 1) % slides.length)
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length)

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 p-6 sm:p-7 lg:p-8">
      <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap sm:gap-4">
        <div className="rounded-full border border-blue-500/50 bg-blue-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-blue-300">
          {slides[current].highlight}
        </div>
        <div className="flex gap-1">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-8 rounded-full transition sm:w-12 ${idx === current ? "bg-blue-500" : "bg-slate-700"}`}
            ></div>
          ))}
        </div>
      </div>
      <div className="mt-5 text-2xl font-semibold text-white sm:text-3xl md:text-4xl">{slides[current].title}</div>
      <div className="mt-3 max-w-3xl text-base text-slate-300 sm:text-lg">{slides[current].description}</div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={prev} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 transition hover:border-blue-500">
          <ChevronLeft size={22} />
        </button>
        <button onClick={next} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 transition hover:border-blue-500">
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  )
}
