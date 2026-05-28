import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDownIcon, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const statusText = "Đang thực hiện / Tạm dừng / Hoàn thành / Hủy";

export const ReportInstructionButton = () => {
  const [activeTab, setActiveTab] = React.useState("nam-thien-long");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group relative inline-flex items-center justify-center cursor-pointer">
          <span className="relative flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-md shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 -skew-x-12 -translate-x-full" />
            <HelpCircle size={14} className="text-orange-100" />
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
            Chú ý màu ở cú pháp tương ứng với màu trong ví dụ.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 text-sm leading-relaxed">
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-4"
            defaultValue="quick-summary"
          >
            <AccordionItem value="quick-summary" className="border-none">
              <AccordionTrigger className="hover:no-underline py-0 [&>svg]:hidden [&[data-state=open]_.custom-chevron]:rotate-180">
                <div className="w-full mb-0">
                  <span className="flex items-center justify-between w-full px-4 py-1 rounded-lg text-sm font-bold text-white shadow-md uppercase tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400/30">
                    A. Tóm tắt nhanh
                    <ChevronDownIcon className="custom-chevron ml-2 size-6 transition-transform duration-200" />
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-4">
                <div className="grid gap-3">
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-400/50">
                    <div className="text-amber-400 font-semibold mb-2">
                      1. Báo cáo ngày - Nam Thiên Long:
                    </div>
                    <div className="text-slate-300 pl-3 mb-1">
                      Cú pháp:{" "}
                      <span className="text-green-400">[Khu vực]</span> +{" "}
                      <span className="text-yellow-300">[Quân số]</span>
                    </div>
                    <div className="text-slate-400 pl-3 text-xs italic">
                      Ví dụ: "
                      <span className="text-green-400">Khu vực Dĩ An</span>{" "}
                      <span className="text-yellow-300">quân số 30/30</span>"
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-400/50">
                    <div className="text-blue-300 font-semibold mb-2">
                      2. Báo cáo công việc khác:
                    </div>
                    <div className="text-slate-300 pl-3 mb-1">
                      Cú pháp:{" "}
                      <span className="text-green-400">[Tên việc]</span> +{" "}
                      <span className="text-amber-400">[Tiến độ hoặc giá trị]</span>
                    </div>
                    <div className="text-slate-400 pl-3 text-xs italic space-y-1">
                      <p>
                        Ví dụ: "
                        <span className="text-green-400">Khảo sát cửa hàng</span>{" "}
                        <span className="text-white">60%</span>"
                      </p>
                      <p>
                        Ví dụ thêm việc con: "Trong{" "}
                        <span className="text-blue-400">Quản lý tài liệu</span>{" "}
                        thêm <span className="text-green-400">Soạn hợp đồng</span>"
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="details" className="border-none">
              <AccordionTrigger className="hover:no-underline py-0 [&>svg]:hidden [&[data-state=open]_.custom-chevron]:rotate-180">
                <div className="w-full mb-0">
                  <span className="flex items-center justify-between w-full px-4 py-1 rounded-lg text-sm font-bold text-white shadow-md uppercase tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 border border-slate-500/30">
                    B. Hướng dẫn chi tiết
                    <ChevronDownIcon className="custom-chevron ml-2 size-6 transition-transform duration-200" />
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-4">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full relative z-0"
                >
                  <TabsList
                    className={`w-full flex items-end p-0 bg-transparent h-auto border-b transition-colors duration-300 ${
                      activeTab === "nam-thien-long"
                        ? "border-amber-500"
                        : "border-blue-500"
                    }`}
                  >
                    <TabsTrigger
                      value="nam-thien-long"
                      className={`flex-1 rounded-t-lg rounded-b-none border-t border-x py-3 font-bold transition-all duration-200 mb-[-1px] z-10 relative ${
                        activeTab === "nam-thien-long"
                          ? "bg-slate-900 border-amber-500 border-b-slate-900 text-amber-500 hover:text-amber-400"
                          : "bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                      }`}
                    >
                      Nam Thiên Long
                    </TabsTrigger>
                    <TabsTrigger
                      value="cong-viec-khac"
                      className={`flex-1 rounded-t-lg rounded-b-none border-t border-x py-3 font-bold transition-all duration-200 mb-[-1px] z-10 relative ${
                        activeTab === "cong-viec-khac"
                          ? "bg-slate-900 border-blue-500 border-b-slate-900 text-blue-500 hover:text-blue-400"
                          : "bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                      }`}
                    >
                      Công việc khác
                    </TabsTrigger>
                  </TabsList>

                  <div
                    className={`border-x border-b bg-black/50 rounded-b-lg p-4 relative z-0 ${
                      activeTab === "nam-thien-long"
                        ? "border-amber-500"
                        : "border-blue-500"
                    }`}
                  >
                    <TabsContent value="nam-thien-long" className="mt-0 space-y-4">
                      <div className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
                        <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-700">
                          <h4 className="font-bold text-white text-sm uppercase">
                            1. Thông tin cần báo cáo
                          </h4>
                        </div>
                        <div className="p-3">
                          <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
                            <li>
                              <strong className="text-white">
                                Từ khóa bắt buộc:
                              </strong>{" "}
                              <span className="text-green-400">
                                Khu vực [Tên nơi làm việc]
                              </span>{" "}
                              +{" "}
                              <span className="text-yellow-300">
                                Quân số [Thực tế/Hợp đồng]
                              </span>
                            </li>
                            <li>
                              <strong className="text-pink-300">
                                Ngày báo cáo:
                              </strong>{" "}
                              mặc định là hôm nay. Nếu báo cáo cho ngày khác,
                              hãy nói rõ như "hôm qua" hoặc "ngày 25/1".
                            </li>
                            <li>
                              Có thể thêm ra quân, rút quân, tăng/giảm vị trí,
                              nhân sự mới/nghỉ, vi phạm, phản ánh của khách hàng.
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
                        <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-700">
                          <h4 className="font-bold text-white text-sm uppercase">
                            2. Ví dụ
                          </h4>
                        </div>
                        <div className="p-3 text-white italic text-sm space-y-2">
                          <p>
                            "Báo cáo hôm qua{" "}
                            <span className="text-green-400">khu vực Bến Cát</span>,{" "}
                            <span className="text-yellow-300">quân số 12/15</span>,
                            tăng vị trí 1, Trần Văn B đi trễ."
                          </p>
                          <p>
                            "<span className="text-green-400">Khu vực Dĩ An</span>{" "}
                            <span className="text-yellow-300">quân số 30 trên 30</span>."
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="cong-viec-khac" className="mt-0 space-y-4">
                      <div className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
                        <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-700">
                          <h4 className="font-bold text-white text-sm uppercase">
                            1. Cách hoạt động
                          </h4>
                        </div>
                        <div className="p-3 space-y-2 text-slate-300 text-sm">
                          <p>
                            Hệ thống so khớp tên công việc theo thứ tự: việc cha,
                            rồi việc con. Nếu không khớp nhưng thuộc một việc cha
                            đã biết, hệ thống sẽ thêm việc con mới.
                          </p>
                          <p className="italic text-amber-400 text-xs">
                            * Có thể báo cáo nhiều việc trong một lần.
                          </p>
                          <p className="text-slate-400 italic text-xs">
                            * Nên nói kèm tên cha: "[Việc con] thuộc [Nhiệm vụ cha]".
                          </p>
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
                        <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-700">
                          <h4 className="font-bold text-white text-sm uppercase">
                            2. Thông tin có thể cung cấp
                          </h4>
                        </div>
                        <div className="p-3 space-y-3 text-sm">
                          <div className="border-b border-slate-700 pb-2">
                            <div className="text-white font-semibold mb-1.5">
                              Nhiệm vụ cha{" "}
                              <span className="text-slate-500 font-normal text-xs">
                                (chỉ cập nhật)
                              </span>
                            </div>
                            <div className="grid grid-cols-1 gap-1 pl-2">
                              <div>
                                <span className="text-green-400 font-bold">
                                  [Tên nhiệm vụ]
                                </span>
                                <span className="text-slate-400">
                                  : tên nhiệm vụ cha trong hệ thống.
                                </span>
                              </div>
                              <div>
                                <span className="text-amber-400 font-bold">
                                  [Giá trị đạt được]
                                </span>
                                <span className="text-slate-400">
                                  : doanh thu, số lần, số lượng hoặc %.
                                </span>
                              </div>
                              <div>
                                <span className="text-purple-400 font-bold">
                                  [Trạng thái]
                                </span>
                                <span className="text-slate-400">: {statusText}.</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-white font-semibold mb-1.5">
                              Việc con{" "}
                              <span className="text-slate-500 font-normal text-xs">
                                (thêm mới hoặc cập nhật)
                              </span>
                            </div>
                            <div className="grid grid-cols-1 gap-1 pl-2">
                              <div>
                                <span className="text-green-400 font-bold">
                                  [Tên việc]
                                </span>
                                <span className="text-slate-400">
                                  : nội dung công việc cụ thể.
                                </span>
                              </div>
                              <div>
                                <span className="text-amber-400 font-bold">
                                  [Tiến độ]
                                </span>
                                <span className="text-slate-400">
                                  : % hoàn thành hoặc mục tiêu cần đạt.
                                </span>
                              </div>
                              <div>
                                <span className="text-purple-400 font-bold">
                                  [Trạng thái]
                                </span>
                                <span className="text-slate-400">: {statusText}.</span>
                              </div>
                              <div>
                                <span className="text-cyan-300 font-bold">
                                  [Ngày bắt đầu] + [Ngày kết thúc]
                                </span>
                                <span className="text-slate-400">
                                  : bắt buộc khi thêm mới việc con.
                                </span>
                              </div>
                            </div>
                            <div className="text-slate-400 italic text-xs mt-1.5 pl-2">
                              * Nếu nói "hoàn thành", hệ thống đặt tiến độ 100%.
                              Nếu tiến độ là 100%, hệ thống chuyển trạng thái thành
                              hoàn thành.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
                        <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-700">
                          <h4 className="font-bold text-white text-sm uppercase">
                            3. Ví dụ
                          </h4>
                        </div>
                        <div className="p-3 space-y-5">
                          <div>
                            <div className="font-semibold text-white mb-2">
                              <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs uppercase border border-blue-500/30">
                                Cập nhật nhiệm vụ cha
                              </span>
                              <div className="text-slate-400 text-xs font-normal mt-2">
                                Cú pháp:{" "}
                                <span className="text-green-400">
                                  [Tên nhiệm vụ]
                                </span>{" "}
                                +{" "}
                                <span className="text-amber-400">
                                  [Giá trị đạt được]
                                </span>
                              </div>
                            </div>
                            <div className="bg-slate-900/50 p-2.5 rounded border border-blue-700/50 text-xs italic text-slate-300 space-y-1">
                              <p>
                                "<span className="text-green-400">Doanh thu</span>{" "}
                                đạt <span className="text-amber-400">50 triệu</span>."
                              </p>
                              <p>
                                "<span className="text-green-400">Xử lý việc</span>{" "}
                                được <span className="text-amber-400">3 lần</span>,{" "}
                                <span className="text-purple-400">hoàn thành</span>."
                              </p>
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold text-white mb-2">
                              <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-xs uppercase border border-green-500/30">
                                Thêm việc con mới
                              </span>
                              <div className="text-slate-400 text-xs font-normal mt-2">
                                Cú pháp:{" "}
                                <span className="text-green-400">
                                  [Tên việc mới]
                                </span>{" "}
                                thuộc{" "}
                                <span className="text-blue-400">
                                  [Nhiệm vụ cha]
                                </span>{" "}
                                +{" "}
                                <span className="text-cyan-300">
                                  [Ngày bắt đầu]
                                </span>{" "}
                                +{" "}
                                <span className="text-cyan-300">
                                  [Ngày kết thúc]
                                </span>
                              </div>
                            </div>
                            <div className="bg-slate-900/50 p-2.5 rounded border border-green-700/50 text-xs italic text-slate-300 space-y-1">
                              <p>
                                "Thêm{" "}
                                <span className="text-green-400">soạn hợp đồng</span>{" "}
                                thuộc{" "}
                                <span className="text-blue-400">
                                  Quản lý tài liệu
                                </span>
                                , bắt đầu{" "}
                                <span className="text-cyan-300">2026-05-28</span>,
                                kết thúc{" "}
                                <span className="text-cyan-300">2026-05-30</span>,
                                đạt <span className="text-amber-400">50%</span>."
                              </p>
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold text-white mb-2">
                              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-xs uppercase border border-amber-500/30">
                                Cập nhật việc con
                              </span>
                              <div className="text-slate-400 text-xs font-normal mt-2">
                                Cú pháp:{" "}
                                <span className="text-green-400">
                                  [Tên việc]
                                </span>{" "}
                                +{" "}
                                <span className="text-amber-400">
                                  [Tiến độ mới]
                                </span>{" "}
                                hoặc{" "}
                                <span className="text-purple-400">
                                  [Trạng thái]
                                </span>
                              </div>
                              <div className="text-slate-500 italic text-xs mt-1">
                                * Cập nhật việc con chỉ cập nhật trạng thái/tiến độ.
                                Ngày bắt đầu và ngày kết thúc chỉ dùng khi thêm mới.
                              </div>
                            </div>
                            <div className="bg-slate-900/50 p-2.5 rounded border border-amber-300/50 text-xs italic text-slate-300 space-y-1">
                              <p>
                                "Cập nhật{" "}
                                <span className="text-green-400">soạn hợp đồng</span>{" "}
                                <span className="text-amber-400">tiến độ 90%</span>."
                              </p>
                              <p>
                                "<span className="text-green-400">Soạn hợp đồng</span>{" "}
                                <span className="text-purple-400">tạm dừng</span>."
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="pt-4 mt-2 border-t border-slate-700">
            <p className="text-center text-slate-400 italic">
              * Bạn có thể nói hoặc viết tự nhiên, không cần đúng từng chữ trong
              cú pháp. Càng đủ thông tin thì càng ít phải chỉnh lại trước khi lưu.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

