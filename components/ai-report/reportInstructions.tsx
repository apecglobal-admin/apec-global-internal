import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

export const ReportInstructionButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 transition-colors cursor-pointer">
          <HelpCircle size={14} />
          <span className="underline decoration-dotted underline-offset-2">
            Hướng dẫn
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-100">
            Hướng dẫn Báo cáo AI
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Cú pháp và ví dụ cho các loại báo cáo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm leading-relaxed mt-2">
          {/* Section 1 */}
          <section className="space-y-3">
            <h3 className="text-base font-bold text-green-400 border-b border-green-500/30 pb-1">
              1. BÁO CÁO NGÀY - NAM THIÊN LONG
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>
                <strong className="text-white">Từ khóa bắt buộc:</strong> Khu
                vực [Tên nơi làm việc] + Quân số [Thực tế/Hợp đồng].
              </li>
              <li>
                <strong className="text-white">Ngày báo cáo:</strong> Mặc định
                là hôm nay. Nếu báo cáo cho ngày khác phải nói rõ (Vd: "Hôm
                qua", "Ngày 25/1").
              </li>
              <li>
                <strong className="text-white">Các thông tin thêm:</strong> Ra
                quân, rút quân, tăng/giảm vị trí, nhân sự mới/nghỉ, vi phạm,...
              </li>
            </ul>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <p className="font-semibold text-slate-400 mb-1 text-xs uppercase">
                Ví dụ:
              </p>
              <ul className="space-y-1 text-white italic">
                <li>
                  "Báo cáo hôm qua khu vực Bến Cát, quân số 12/15, tăng vị trí
                  1, Trần Văn B đi trễ."
                </li>
                <li>"Khu vực Dĩ An quân số 30 trên 30."</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h3 className="text-base font-bold text-amber-400 border-b border-amber-500/30 pb-1">
              2. BÁO CÁO CÔNG VIỆC KHÁC
            </h3>
            <p className="text-slate-300">
              Hệ thống tự động phân loại dựa trên{" "}
              <strong className="text-white">TÊN CÔNG VIỆC</strong> bạn nhắc
              đến. Nếu việc chưa có trong hệ thống thì sẽ thêm mới, nếu đã có và
              chưa hoàn thành thì sẽ cập nhật.
            </p>

            <div className="space-y-3 mt-2">
              <div>
                <h4 className="font-bold text-blue-300 mb-1">
                  • Thêm việc mới:
                </h4>
                <p className="text-slate-300 mb-1">
                  Nêu rõ [Dự án] + [Tên việc] + [Tiến độ] + [Deadline].
                </p>
                <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                  <p className="italic text-white">
                    "Dự án Lifecare soạn hợp đồng đạt 50%, deadline 14/2."
                  </p>
                  <p className="italic text-white">
                    "Hoàn thành đăng 10 post Facebook dự án Queency."
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-blue-300 mb-1">
                  • Cập nhật việc cũ:
                </h4>
                <p className="text-slate-300 mb-1">
                  Nêu rõ [Tên việc] + [Tiến độ mới] hoặc [Trạng thái].
                </p>
                <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                  <p className="italic text-white">
                    "Việc soạn hợp đồng dự án Lifecare đã hoàn thành."
                  </p>
                  <p className="italic text-white">
                    "Soạn hợp đồng dự án Lifecare tiến độ 80%, đang chờ duyệt."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Note */}
          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
            <h4 className="font-bold text-blue-200 mb-2 uppercase text-xs">
              Lưu ý quan trọng:
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>
                Nếu việc đã xong, bạn chỉ cần nói "Hoàn thành" hoặc "Xong" +
                [Tên việc].
              </li>
              <li>
                Nếu việc chưa xong, vui lòng kèm theo [Tiến độ] và [Trạng thái]
                (nếu có).
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
