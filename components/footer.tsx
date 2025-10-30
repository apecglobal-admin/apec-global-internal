"use client"

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">ApecGlobal Intranet</div>
          <h3 className="mt-2 text-2xl font-bold text-white">© 2025 – Tập đoàn Hợp danh ApecGlobal. All rights reserved.</h3>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
            <a href="#" className="rounded-full border border-slate-800 px-4 py-2 hover:border-blue-500 hover:text-white">
              Chính sách
            </a>
            <a href="#" className="rounded-full border border-slate-800 px-4 py-2 hover:border-blue-500 hover:text-white">
              Quy chế
            </a>
            <a href="#" className="rounded-full border border-slate-800 px-4 py-2 hover:border-blue-500 hover:text-white">
              Trung tâm hỗ trợ
            </a>
            <a href="#" className="rounded-full border border-slate-800 px-4 py-2 hover:border-blue-500 hover:text-white">
              Liên hệ kỹ thuật
            </a>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-400">
          <div>
            <div className="uppercase tracking-[0.3em] text-blue-400">Tải ứng dụng</div>
            <div className="mt-2 flex gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-xs text-slate-500">
                QR Apec Space
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-xs text-slate-500">
                QR GuardCam
              </div>
            </div>
          </div>
          <div>
            <div className="uppercase tracking-[0.3em] text-blue-400">Kênh hỗ trợ 24/7</div>
            <p className="mt-2 text-slate-300">Zalo: @ApecTechSupport • Email: support@apecglobal.internal • Hotline: 1900.555.886</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
