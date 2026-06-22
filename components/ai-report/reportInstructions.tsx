import React from "react";
import { HelpCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Example = ({ children }: { children: React.ReactNode }) => (
  <p className="rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs italic text-slate-300">
    “{children}”
  </p>
);

export const ReportInstructionButton = () => (
  <Dialog>
    <DialogTrigger asChild>
      <button
        type="button"
        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-md px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
      >
        <HelpCircle size={14} className="text-white" />
        Hướng dẫn
      </button>
    </DialogTrigger>

    <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto bg-slate-900 border-slate-700 text-slate-100 p-6 rounded-2xl shadow-2xl">
      {/* Đè z-index lên trên AIReportModal (z-[101]) và giảm độ tối của overlay */}
      <style>{`
        [data-slot="dialog-overlay"] {
          z-index: 199 !important;
          background-color: rgba(0, 0, 0, 0.4) !important;
          backdrop-filter: blur(2px) !important;
        }
        [data-slot="dialog-content"] {
          z-index: 200 !important;
        }
      `}</style>
      <DialogHeader>
        <DialogTitle className="text-white text-lg font-bold">Hướng dẫn Báo cáo AI</DialogTitle>
        <DialogDescription className="text-slate-300 text-sm">
          Có thể nói hoặc nhập tự nhiên. Dùng đúng tên task sẽ giúp AI nhận
          diện chính xác hơn.
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="nam-thien-long">
        <TabsList className="grid w-full grid-cols-2 bg-slate-950/80 border border-slate-800 mt-3 rounded-lg">
          <TabsTrigger
            value="nam-thien-long"
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400"
          >
            Nam Thiên Long
          </TabsTrigger>
          <TabsTrigger
            value="task"
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400"
          >
            Công việc
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nam-thien-long">
          <div className="flex flex-col gap-2">
            <section className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/30 p-4">
              <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-1 uppercase tracking-wide">
                1. THÔNG TIN CẦN BÁO CÁO
              </h4>
              <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2">
                <li>
                  <strong className="text-slate-100">Từ khóa bắt buộc:</strong>{" "}
                  <span className="text-emerald-400">Khu vực [Tên nơi làm việc]</span>{" "}
                  +{" "}
                  <span className="text-amber-400">Quân số [Thực tế/Hợp đồng]</span>
                </li>
                <li>
                  <strong className="text-pink-300">Ngày báo cáo:</strong> mặc định là hôm nay. Nếu báo cáo cho ngày khác, hãy nói rõ như "hôm qua" hoặc "ngày 25/1".
                </li>
                <li>
                  Có thể thêm ra quân, rút quân, tăng/giảm vị trí, nhân sự mới/nghỉ, vi phạm, phản ánh của khách hàng.
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/30 p-4">
              <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-1 uppercase tracking-wide">
                2. VÍ DỤ
              </h4>
              <div className="flex flex-col gap-3 text-sm italic text-slate-300 pl-1 py-1">
                <p>
                  "Báo cáo hôm qua{" "}
                  <span className="text-emerald-400 font-medium">khu vực Bến Cát</span>
                  , quân số 12/15, tăng vị trí 1, Trần Văn B đi trễ."
                </p>
                <p>
                  "
                  <span className="text-emerald-400 font-medium">Khu vực Dĩ An</span>{" "}
                  <span className="text-amber-400 font-medium">quân số 30 trên 30.</span>
                  "
                </p>
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="task">
          <div className="flex flex-col gap-2">
            <section className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-950/30 p-4">
              <h4 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-1.5">
                Chức năng hỗ trợ
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-emerald-950/50 text-emerald-400 border border-emerald-900/30"
                >
                  Tạo Nhiệm vụ cha
                </Badge>
                <Badge
                  variant="outline"
                  className="text-sky-400 border-sky-800 bg-sky-950/20"
                >
                  Cập nhật tiến độ
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-emerald-950/50 text-emerald-400 border border-emerald-900/30"
                >
                  Tạo Nhiệm vụ con cấp 1
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Có thể báo cáo nhiều việc cùng lúc.
              </p>
            </section>

            <section className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/30 p-4">
              <h4 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-1.5 mb-1">
                Cách nói để AI nhận diện
              </h4>
              <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2">
                <li>
                  <strong className="text-emerald-400">Tạo việc:</strong> Nói rõ tên việc.
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-xs text-slate-400">
                    <li>Mặc định tạo việc con (thêm từ khóa "cha" để tạo việc cha).</li>
                    <li>Mặc định thời gian là <strong>hôm nay</strong> (hoặc nói rõ từ ngày... đến ngày...).</li>
                    <li>Tự động đặt tiến độ <strong>100%</strong> nếu báo cáo việc đã xong.</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-sky-400">Cập nhật tiến độ:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-xs text-slate-400">
                    <li>Nói rõ tên việc kèm số % (ví dụ: "lên 70%").</li>
                    <li>Đạt 100% tự động đổi trạng thái thành Hoàn thành.</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/30 p-4">
              <h4 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-1.5 mb-1">
                Ví dụ
              </h4>
              <Example>
                <span className="text-emerald-400 font-bold">Tạo nhiệm vụ cha</span>{" "}
                <span className="text-sky-400 font-bold">Tuyển dụng nhân sự</span>.
              </Example>
              <Example>
                Trong nhiệm vụ <span className="text-sky-400 font-bold">Tuyển dụng nhân sự</span>,{" "}
                đã làm xong <span className="text-emerald-400 font-bold">Lọc hồ sơ ứng viên</span>.
              </Example>
              <Example>
                Báo cáo <span className="text-emerald-400 font-bold">thiết kế xong banner</span> từ hôm nay đến 25/6.
              </Example>
              <Example>
                Cập nhật <span className="text-sky-400 font-bold">Soạn hợp đồng</span> lên{" "}
                <span className="text-amber-400 font-bold">70%</span>.
              </Example>
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
);
