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
          <span>Hướng dẫn</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-100">
            Hướng dẫn Báo cáo AI
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Chú ý màu ở phần hướng dẫn tương ứng với màu trong ví dụ
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm leading-relaxed mt-4">
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="w-full mb-3">
              <span className="flex items-center justify-center w-full px-3 py-1.5 rounded-lg text-sm font-bold bg-amber-900/50 text-white border border-amber-700 shadow-md uppercase tracking-wide">
                1. BÁO CÁO NGÀY - NAM THIÊN LONG
              </span>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>
                <div className="mb-1">
                  <strong className="text-white">Từ khóa bắt buộc: </strong>
                  <span className="text-green-400">
                    Khu vực [Tên nơi làm việc]
                  </span>
                  {" + "}
                  <span className="text-yellow-300">
                    Quân số [Thực tế/Hợp đồng]
                  </span>
                </div>
              </li>
              <li>
                <strong className="text-pink-300">Ngày báo cáo:</strong> Mặc
                định là hôm nay. Nếu báo cáo cho ngày khác phải nói rõ (Vd: "Hôm
                qua", "Ngày 25/1").
              </li>
              <li>
                <strong className="text-white">Các thông tin thêm:</strong> Ra
                quân, rút quân, tăng/giảm vị trí, nhân sự mới/nghỉ, vi phạm,... (nếu không nhắc đến thì mặc định là 0).
              </li>
            </ul>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <p className="font-semibold text-slate-400 mb-1 text-xs uppercase">
                Ví dụ:
              </p>
              <ul className="space-y-1 text-white italic">
                <li>
                  "<span className="text-pink-300">Báo cáo hôm qua</span>{" "}
                  <span className="text-green-400">khu vực Bến Cát</span>,{" "}
                  <span className="text-yellow-300">quân số 12/15</span>, tăng
                  vị trí 1, Trần Văn B đi trễ."
                </li>
                <li>
                  "<span className="text-green-400">Khu vực Dĩ An</span>
                  <span className="text-yellow-300"> quân số 30 trên 30</span>."
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 mt-4">
            <div className="w-full mb-3">
              <span className="flex items-center justify-center w-full px-3 py-1.5 rounded-lg text-sm font-bold bg-amber-900/50 text-white border border-amber-700 shadow-md uppercase tracking-wide">
                2. BÁO CÁO CÔNG VIỆC KHÁC
              </span>
            </div>
            <p className="text-slate-300">
              Hệ thống tự động phân loại dựa trên{" "}
              <strong className="text-green-400">TÊN CÔNG VIỆC</strong> bạn nhắc
              đến.
            </p>
            <p className="text-slate-300">
              Nếu việc chưa có trong hệ thống thì sẽ{" "}
              <span className="text-white">THÊM MỚI</span>, nếu đã có và chưa
              hoàn thành thì sẽ <span className="text-white">CẬP NHẬT</span>.
            </p>
            <p className="text-slate-300">Có thể báo cáo nhiều việc 1 lần.</p>

            <div className="grid grid-cols-1 gap-1 text-xs text-slate-400 bg-slate-800/30 p-2.5 rounded border border-slate-700/50 mt-1">
              <p className="font-semibold text-slate-400 mb-1 text-xs uppercase">
                Các phần thông tin:
              </p>
              <div>
                <span className="text-blue-300 font-medium">[Dự án]</span>: Tên
                dự án (VD: Lifecare, Queency...).
              </div>
              <div>
                <span className="text-green-400 font-medium">[Tên việc]</span>:
                Nội dung công việc cụ thể.
              </div>
              <div>
                <span className="text-amber-400 font-medium">[Tiến độ]</span>: %
                hoàn thành.
              </div>
              <div>
                <span className="text-red-400 font-medium">[Deadline]</span>:
                Hạn hoàn thành (17/2, "hôm nay", "ngày mai",...).
              </div>
              <div>
                <span className="text-purple-400 font-medium">
                  [Trạng thái]
                </span>
                : Đang làm / Hoàn thành / Chờ duyệt / Tạm dừng.
                <div className="text-slate-500 italic mt-0.5">
                  (Nếu "hoàn thành" thì hệ thống tự hiểu tiến độ 100% và
                  deadline là hôm nay)
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-2">
              <div>
                <h4 className="font-bold text-white mb-1">• Thêm việc mới:</h4>
                <p className="text-slate-300 mb-1">
                  Nêu rõ{" "}
                  <span className="text-blue-300 font-semibold">[Dự án]</span>
                  {" + "}
                  <span className="text-green-400 font-semibold">
                    [Tên việc]
                  </span>
                  {" + "}
                  <span className="text-amber-400 font-semibold">
                    [Tiến độ]
                  </span>
                  {" + "}
                  <span className="text-red-400 font-semibold">[Deadline]</span>
                </p>
                <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                  <p className="font-semibold text-slate-400 mb-1 text-xs uppercase">
                    Ví dụ:
                  </p>
                  <p className="italic text-white">
                    "<span className="text-blue-300">Dự án Lifecare</span>{" "}
                    <span className="text-green-400">soạn hợp đồng</span>{" "}
                    <span className="text-amber-400">đạt 50%</span>,{" "}
                    <span className="text-red-400">deadline 14/2</span>."
                  </p>
                  <p className="italic text-white">
                    "<span className="text-purple-400">Hoàn thành</span>{" "}
                    <span className="text-green-400">
                      đăng 10 post Facebook
                    </span>{" "}
                    <span className="text-blue-300">dự án Queency</span>."
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">
                  • Cập nhật việc cũ:
                </h4>
                <p className="text-slate-300 mb-1">
                  Nêu rõ{" "}
                  <span className="text-green-400 font-semibold">
                    [Tên việc]
                  </span>{" "}
                  +{" "}
                  <span className="text-amber-400 font-semibold">
                    [Tiến độ mới]
                  </span>{" "}
                  <span className="text-slate-400 font-normal italic">(%)</span>{" "}
                  hoặc{" "}
                  <span className="text-purple-400 font-semibold">
                    [Trạng thái]
                  </span>
                  .
                </p>
                <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                  <p className="font-semibold text-slate-400 mb-1 text-xs uppercase">
                    Ví dụ:
                  </p>
                  <p className="italic text-white">
                    "Việc <span className="text-green-400">soạn hợp đồng</span>{" "}
                    <span className="text-amber-400">tiến độ 90 phần trăm</span>
                    ."
                  </p>
                  <p className="italic text-white">
                    "Việc <span className="text-green-400">soạn hợp đồng</span>{" "}
                    <span className="text-purple-400">hoàn thành</span>."
                  </p>
                  <p className="italic text-white">
                    "<span className="text-green-400">Soạn hợp đồng</span>{" "}
                    <span className="text-blue-300">dự án Lifecare</span>{" "}
                    <span className="text-amber-400">tiến độ 80%</span>,{" "}
                    <span className="text-purple-400">đang chờ duyệt</span>."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Natural Language Note */}
          <div className="pt-4 mt-2 border-t border-slate-700">
            <p className="text-center text-slate-400 italic">
              * Bạn có thể nói/viết tự nhiên vì hệ thống sẽ tự hiểu, miễn là có đủ các phần tối thiểu.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
