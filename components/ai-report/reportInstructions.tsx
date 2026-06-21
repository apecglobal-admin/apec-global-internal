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

const statusText = "Đang thực hiện / Tạm dừng / Hoàn thành / Hủy";

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
          Bạn có thể nói hoặc nhập tự nhiên. Dùng đúng tên task sẽ giúp AI nhận
          diện chính xác hơn.
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="nam-thien-long">
        <TabsList className="grid w-full grid-cols-2 bg-slate-950/80 border border-slate-800 p-1 rounded-lg">
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

        <TabsContent value="nam-thien-long" className="mt-4">
          <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/30 p-4">
              <h4 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-1.5 mb-1">
                Thông tin cần báo cáo
              </h4>
              <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2">
                <li>
                  <strong className="text-rose-400">Bắt buộc</strong> phải nói rõ{" "}
                  <strong className="text-sky-400">khu vực</strong> và{" "}
                  <strong className="text-sky-400">quân số</strong> thực tế/hợp đồng.
                </li>
                <li>
                  Thời gian mặc định là <strong>hôm nay</strong>; có thể báo cáo cho{" "}
                  <strong>hôm qua</strong> hoặc ngày cụ thể.
                </li>
                <li>
                  Có thể báo cáo thêm:{" "}
                  <span className="text-emerald-400 font-semibold">ra quân</span>,{" "}
                  <span className="text-rose-400 font-semibold">rút quân (thanh lý)</span>,{" "}
                  <span className="text-emerald-400 font-semibold">tăng/giảm vị trí</span>,{" "}
                  <span className="text-emerald-400 font-semibold">nhân sự mới</span>,{" "}
                  <span className="text-rose-400 font-semibold">nghỉ việc</span>,{" "}
                  <span className="text-rose-400 font-semibold">vi phạm/sự cố</span> và{" "}
                  <span className="text-sky-400 font-semibold">phản ánh của khách hàng</span>.
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/30 p-4">
              <h4 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-1.5 mb-1">
                Ví dụ thực tế
              </h4>
              <Example>
                Báo cáo hôm qua khu vực{" "}
                <span className="text-sky-400 font-bold">Bến Cát</span>, quân số{" "}
                <span className="text-slate-100 font-bold">12/15</span>,{" "}
                <span className="text-emerald-400 font-bold">tăng vị trí 1</span>, Trần
                Văn B <span className="text-rose-400 font-bold">đi trễ</span>.
              </Example>
              <Example>
                Khu vực <span className="text-sky-400 font-bold">Dĩ An</span>, quân số{" "}
                <span className="text-slate-100 font-bold">30 trên 30</span>.
              </Example>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="task" className="mt-4">
          <div className="flex flex-col gap-4">
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
                Hỗ trợ các trạng thái:{" "}
                <span className="text-slate-200 font-bold">{statusText}</span>. Bạn có
                thể nói nhiều lệnh cùng lúc.
              </p>
            </section>

            <section className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/30 p-4">
              <h4 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-1.5 mb-1">
                Cách nói để AI nhận diện
              </h4>
              <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2">
                <li>
                  <strong className="text-emerald-400">Tạo Nhiệm vụ cha mới:</strong>{" "}
                  Chỉ cần nói rõ <strong className="text-sky-400">tên việc</strong>.
                  Các thông tin còn lại sẽ được chọn trong bước xem trước.
                </li>
                <li>
                  <strong className="text-emerald-400">Tạo Nhiệm vụ con cấp 1:</strong>{" "}
                  Nói rõ <strong className="text-sky-400">tên nhiệm vụ con</strong> và{" "}
                  <strong className="text-sky-400">tên nhiệm vụ cha</strong>.
                </li>
                <li>
                  <strong className="text-sky-400">Cập nhật báo cáo:</strong> Cần
                  nói rõ <strong className="text-sky-400">tên nhiệm vụ cha/con</strong>,
                  tiến độ hoặc trạng thái.
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/30 p-4">
              <h4 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-1.5 mb-1">
                Ví dụ thực tế
              </h4>
              <Example>
                <span className="text-emerald-400 font-bold">Tạo Nhiệm vụ cha</span>{" "}
                <span className="text-sky-400 font-bold">Gọi khách hàng</span>.
              </Example>
              <Example>
                Trong <span className="text-sky-400 font-bold">Quản lý tài liệu</span>,{" "}
                <span className="text-emerald-400 font-bold">thêm Nhiệm vụ con cấp 1</span>{" "}
                <span className="text-white font-bold">Soạn hợp đồng</span> từ hôm nay
                đến ngày 25/6.
              </Example>
              <Example>
                <span className="text-sky-400 font-bold">Cập nhật</span>{" "}
                <span className="text-white font-bold">Soạn hợp đồng</span> lên{" "}
                <span className="text-amber-400 font-bold">70%</span>.
              </Example>
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
);
