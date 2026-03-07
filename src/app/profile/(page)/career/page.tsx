import { Briefcase, ChevronRight } from "lucide-react";

export default function CareerPage() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 max-w-md mx-auto text-center">
                <h3 className="text-2xl font-bold text-slate-100 mb-2">Lộ trình nghề nghiệp</h3>
                <p className="text-slate-400 text-sm mb-6">Khám phá và phát triển con đường sự nghiệp của bạn</p>
                <a
                    href="https://lotrinh.apecglobal.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
                >
                    <Briefcase size={20} />
                    Xem lộ trình nghề nghiệp
                    <ChevronRight size={20} />
                </a>
            </div>
        </div>
    );
}