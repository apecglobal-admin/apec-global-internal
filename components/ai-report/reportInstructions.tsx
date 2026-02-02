import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { HelpCircle, ChevronDownIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const ReportInstructionButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group relative inline-flex items-center justify-center cursor-pointer">
          {/* Continuous pulse/ping effect */}
          <span className="absolute inset-0 rounded-full bg-blue-500 opacity-25 animate-ping" />
          
          <span className="relative flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 -skew-x-12 -translate-x-full" />
            <HelpCircle size={14} className="text-blue-100" />
            <span>Hướng dẫn</span>
          </span>
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

          {/* Summary Section */}
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 mb-6">
             <h3 className="text-white font-bold mb-3 uppercase text-sm border-b border-slate-700 pb-2">Tóm tắt nhanh</h3>
             <div className="space-y-3 text-sm">
                <div>
                   <div className="text-amber-400 font-semibold mb-1">1. Báo cáo ngày - Nam Thiên Long:</div>
                   <div className="text-slate-300 pl-3">
                      Cú pháp: <span className="text-green-400">[Khu vực]</span> + <span className="text-yellow-300">[Quân số]</span>
                   </div>
                   <div className="text-slate-400 pl-3 text-xs italic mt-1">
                      Ví dụ: "<span className="text-green-400">Khu vực Dĩ An</span> <span className="text-yellow-300">quân số 30/30</span>"
                   </div>
                </div>
                <div>
                   <div className="text-blue-300 font-semibold mb-1">2. Báo cáo công việc khác:</div>
                   <div className="text-slate-300 pl-3">
                       Cú pháp: <span className="text-green-400">[Tên việc]</span>
                   </div>
                   <div className="text-slate-400 pl-3 text-xs italic mt-1">
                      Ví dụ: "<span className="text-green-400">Soạn hợp đồng</span>"
                   </div>
                </div>
             </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details" className="border-none">
              <AccordionTrigger className="hover:no-underline py-0 [&>svg]:hidden [&[data-state=open]_.custom-chevron]:rotate-180">
                <div className="w-full mb-0">
                  <span className="flex items-center justify-center w-full px-3 py-1.5 rounded-lg text-sm font-bold bg-slate-800 text-white border border-slate-600 shadow-md uppercase tracking-wide">
                    HƯỚNG DẪN CHI TIẾT
                    <ChevronDownIcon className="custom-chevron ml-2 size-4 transition-transform duration-200" />
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Tabs defaultValue="nam-thien-long" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                    <TabsTrigger
                      value="nam-thien-long"
                      className="data-[state=active]:bg-amber-900/40 data-[state=active]:text-amber-100"
                    >
                      Nam Thiên Long
                    </TabsTrigger>
                    <TabsTrigger
                      value="cong-viec-khac"
                      className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-100"
                    >
                      Công việc khác
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="nam-thien-long"
                    className="mt-4 space-y-3"
                  >
                    <ul className="list-disc pl-5 space-y-2 text-slate-300">
                      <li>
                        <div className="mb-1">
                          <strong className="text-white">
                            Từ khóa bắt buộc:{" "}
                          </strong>
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
                        <strong className="text-pink-300">
                          Ngày báo cáo:
                        </strong>{" "}
                        Mặc định là hôm nay. Nếu báo cáo cho ngày khác phải nói
                        rõ (Vd: "Hôm qua", "Ngày 25/1").
                      </li>
                      <li>
                        <strong className="text-white">
                          Các thông tin thêm:
                        </strong>{" "}
                        Ra quân, rút quân, tăng/giảm vị trí, nhân sự mới/nghỉ,
                        vi phạm,... (nếu không nhắc đến thì mặc định là 0).
                      </li>
                    </ul>
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 mt-3">
                      <p className="font-semibold text-slate-400 mb-1 text-xs uppercase">
                        Ví dụ:
                      </p>
                      <ul className="space-y-1 text-white italic">
                        <li>
                          "
                          <span className="text-pink-300">
                            Báo cáo hôm qua
                          </span>{" "}
                          <span className="text-green-400">
                            khu vực Bến Cát
                          </span>
                          ,{" "}
                          <span className="text-yellow-300">
                            quân số 12/15
                          </span>
                          , tăng vị trí 1, Trần Văn B đi trễ."
                        </li>
                        <li>
                          "
                          <span className="text-green-400">
                            Khu vực Dĩ An
                          </span>
                          <span className="text-yellow-300">
                            {" "}
                            quân số 30 trên 30
                          </span>
                          ."
                        </li>
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="cong-viec-khac"
                    className="mt-4 space-y-3"
                  >
                    <p className="text-slate-300">
                      Hệ thống tự động phân loại dựa trên{" "}
                      <strong className="text-green-400">
                        TÊN CÔNG VIỆC
                      </strong>{" "}
                      bạn nhắc đến.
                    </p>
                    <p className="text-slate-300">
                      Nếu việc chưa có trong hệ thống thì sẽ{" "}
                      <span className="text-white">THÊM MỚI</span>, nếu đã
                      có và chưa hoàn thành thì sẽ{" "}
                      <span className="text-white">CẬP NHẬT</span>.
                    </p>
                    <p className="text-slate-300">
                      Có thể báo cáo nhiều việc 1 lần.
                    </p>

                    <div className="grid grid-cols-1 gap-1 text-xs text-slate-400 bg-slate-800/30 p-2.5 rounded border border-slate-700/50 mt-1">
                      <p className="font-semibold text-slate-400 mb-1 text-xs uppercase">
                        Các phần thông tin:
                      </p>
                      <div>
                        <span className="text-blue-300 font-medium">
                          [Dự án]
                        </span>
                        : Tên dự án (VD: Lifecare, Queency...).
                      </div>
                      <div>
                        <span className="text-green-400 font-medium">
                          [Tên việc]
                        </span>
                        : Nội dung công việc cụ thể.
                      </div>
                      <div>
                        <span className="text-amber-400 font-medium">
                          [Tiến độ]
                        </span>
                        : % hoàn thành.
                      </div>
                      <div>
                        <span className="text-red-400 font-medium">
                          [Deadline]
                        </span>
                        : Hạn hoàn thành (17/2, "hôm nay", "ngày mai",...).
                      </div>
                      <div>
                        <span className="text-purple-400 font-medium">
                          [Trạng thái]
                        </span>
                        : Đang làm / Hoàn thành / Chờ duyệt / Tạm dừng.
                        <div className="text-slate-500 italic mt-0.5">
                          (Nếu "hoàn thành" thì hệ thống tự hiểu tiến độ
                          100% và deadline là hôm nay)
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mt-2">
                      <div>
                        <h4 className="font-bold text-white mb-1">
                          • Thêm việc mới:
                        </h4>
                        <p className="text-slate-300 mb-1">
                          Nêu rõ{" "}
                          <span className="text-blue-300 font-semibold">
                            [Dự án]
                          </span>
                          {" + "}
                          <span className="text-green-400 font-semibold">
                            [Tên việc]
                          </span>
                          {" + "}
                          <span className="text-amber-400 font-semibold">
                            [Tiến độ]
                          </span>
                          {" + "}
                          <span className="text-red-400 font-semibold">
                            [Deadline]
                          </span>
                        </p>
                        <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                          <p className="font-semibold text-slate-400 mb-1 text-xs uppercase">
                            Ví dụ:
                          </p>
                          <p className="italic text-white">
                            "
                            <span className="text-blue-300">
                              Dự án Lifecare
                            </span>{" "}
                            <span className="text-green-400">
                              soạn hợp đồng
                            </span>{" "}
                            <span className="text-amber-400">
                              đạt 50%
                            </span>
                            ,{" "}
                            <span className="text-red-400">
                              deadline 14/2
                            </span>
                            ."
                          </p>
                          <p className="italic text-white">
                            "
                            <span className="text-purple-400">
                              Hoàn thành
                            </span>{" "}
                            <span className="text-green-400">
                              đăng 10 post Facebook
                            </span>{" "}
                            <span className="text-blue-300">
                              dự án Queency
                            </span>
                            ."
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
                          <span className="text-slate-400 font-normal italic">
                            (%)
                          </span>{" "}
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
                            "Việc{" "}
                            <span className="text-green-400">
                              soạn hợp đồng
                            </span>{" "}
                            <span className="text-amber-400">
                              tiến độ 90 phần trăm
                            </span>
                            ."
                          </p>
                          <p className="italic text-white">
                            "Việc{" "}
                            <span className="text-green-400">
                              soạn hợp đồng
                            </span>{" "}
                            <span className="text-purple-400">
                              hoàn thành
                            </span>
                            ."
                          </p>
                          <p className="italic text-white">
                            "
                            <span className="text-green-400">
                              Soạn hợp đồng
                            </span>{" "}
                            <span className="text-blue-300">
                              dự án Lifecare
                            </span>{" "}
                            <span className="text-amber-400">
                              tiến độ 80%
                            </span>
                            ,{" "}
                            <span className="text-purple-400">
                              đang chờ duyệt
                            </span>
                            ."
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Natural Language Note */}
          <div className="pt-4 mt-2 border-t border-slate-700">
            <p className="text-center text-slate-400 italic">
              * Bạn có thể nói/viết tự nhiên vì hệ thống sẽ tự hiểu.<br/>Khuyến khích báo cáo đủ thông tin trong <span className="font-semibold text-white">hướng dẫn chi tiết</span> để tiết kiệm thời gian chỉnh sửa.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
