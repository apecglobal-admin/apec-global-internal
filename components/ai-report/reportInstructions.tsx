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
            Chú ý <u>màu ở cú pháp</u> tương ứng với <u>màu trong ví dụ</u>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 text-sm leading-relaxed">

          <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="quick-summary">
            <AccordionItem value="quick-summary" className="border-none">
              <AccordionTrigger className="hover:no-underline py-0 [&>svg]:hidden [&[data-state=open]_.custom-chevron]:rotate-180">
                <div className="w-full mb-0">
                  <span className="flex items-center justify-between w-full px-4 py-1 rounded-lg text-sm font-bold text-white shadow-md uppercase tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400/30">
                    A. TÓM TẮT NHANH
                    <ChevronDownIcon className="custom-chevron ml-2 size-6 transition-transform duration-200" />
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="grid gap-3">
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-400/50">
                    <div className="text-amber-400 font-semibold mb-2">1. Báo cáo ngày - Nam Thiên Long:</div>
                    <div className="text-sm">
                      <div className="text-slate-300 pl-3 mb-1">
                        Cú pháp: <span className="text-green-400">[Khu vực]</span> + <span className="text-yellow-300">[Quân số]</span>
                      </div>
                      <div className="text-slate-400 pl-3 text-xs italic">
                        Ví dụ: "<span className="text-green-400">Khu vực Dĩ An</span> <span className="text-yellow-300">quân số 30/30</span>"
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-400/50">
                    <div className="text-blue-300 font-semibold mb-2">2. Báo cáo công việc khác:</div>
                    <div className="text-sm">
                      <div className="text-slate-300 pl-3 mb-1">
                        Cú pháp: <span className="text-green-400">[Tên việc]</span>
                      </div>
                      <div className="text-slate-400 pl-3 text-xs italic">
                        Ví dụ: "<span className="text-green-400">Soạn hợp đồng</span>"<br/>
                        Ví dụ: "<span className="text-green-400">Khảo sát cửa hàng</span>"<br/>
                        Ví dụ: "<span className="text-green-400">Ký hợp đồng phân phối sản phẩm Spa Queency</span>"
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="details" className="border-none">
              <AccordionTrigger className="hover:no-underline py-0 [&>svg]:hidden [&[data-state=open]_.custom-chevron]:rotate-180">
                <div className="w-full mb-0">
                  <span className="flex items-center justify-between w-full px-4 py-1 rounded-lg text-sm font-bold text-white shadow-md uppercase tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 border border-slate-500/30">
                    B. HƯỚNG DẪN CHI TIẾT
                    <ChevronDownIcon className="custom-chevron ml-2 size-6 transition-transform duration-200" />
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full relative z-0">
                  <TabsList 
                    className={`w-full flex items-end p-0 bg-transparent h-auto border-b transition-colors duration-300 ${
                      activeTab === "nam-thien-long" ? "border-amber-500" : "border-blue-500"
                    }`}
                  >
                    <TabsTrigger
                      value="nam-thien-long"
                      className={`flex-1 rounded-t-lg rounded-b-none border-t border-x py-3 font-bold transition-all duration-200 mb-[-1px] z-10 relative
                        ${activeTab === "nam-thien-long" 
                          ? "bg-slate-900 border-amber-500 border-b-slate-900 text-amber-500 hover:text-amber-400" 
                          : "bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                        }
                      `}
                    >
                      Nam Thiên Long
                    </TabsTrigger>
                    <TabsTrigger
                      value="cong-viec-khac"
                      className={`flex-1 rounded-t-lg rounded-b-none border-t border-x py-3 font-bold transition-all duration-200 mb-[-1px] z-10 relative
                        ${activeTab === "cong-viec-khac" 
                          ? "bg-slate-900 border-blue-500 border-b-slate-900 text-blue-500 hover:text-blue-400" 
                          : "bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                        }
                      `}
                    >
                      Công việc khác
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className={`border-x border-b bg-black/50 rounded-b-lg p-4 relative z-0 ${
                      activeTab === "nam-thien-long" ? "border-amber-500" : "border-blue-500"
                    }`}>
                    <TabsContent
                      value="nam-thien-long"
                      className="mt-0 space-y-4"
                    >
                      {/* Section 1: Thông tin cần báo cáo */}
                      <div className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
                        <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-700">
                          <h4 className="font-bold text-white text-sm uppercase">1. Thông tin cần báo cáo</h4>
                        </div>
                        <div className="p-3">
                          <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
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
                        </div>
                      </div>

                      {/* Section 2: Ví dụ mẫu */}
                      <div className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
                        <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-700">
                          <h4 className="font-bold text-white text-sm uppercase">2. Ví dụ</h4>
                        </div>
                        <div className="p-3">
                            <ul className="space-y-1 text-white italic text-sm">
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
                      </div>
                    </TabsContent>

                   <TabsContent value="cong-viec-khac" className="mt-0 space-y-4">
                    
                    {/* Section 1: Cách hoạt động */}
                    <div className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
                      <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-700">
                        <h4 className="font-bold text-white text-sm uppercase">1. Giải thích cách hoạt động</h4>
                      </div>
                      <div className="p-3 space-y-2 text-slate-300">
                        <p>
                          Hệ thống tự động phân loại dựa trên <strong className="text-green-400">TÊN CÔNG VIỆC</strong> bạn nhắc đến.
                        </p>
                        <p>
                          Nếu việc chưa có trong hệ thống thì sẽ <span className="text-white font-semibold">THÊM MỚI</span>, nếu đã có và chưa hoàn thành thì sẽ <span className="text-white font-semibold">CẬP NHẬT</span>.
                        </p>
                        <p className="italic text-slate-400 text-xs">
                          * Có thể báo cáo nhiều việc 1 lần.
                        </p>
                      </div>
                    </div>

                    {/* Section 2: Các phần thông tin */}
                    <div className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
                      <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-700">
                        <h4 className="font-bold text-white text-sm uppercase">2. Các phần thông tin</h4>
                      </div>
                      <div className="p-3 grid grid-cols-1 gap-2 text-sm">
                        <div>
                          <span className="text-blue-300 font-bold">[Dự án]</span>
                          <span className="text-slate-400">: Tên dự án (VD: Lifecare, Queency...).</span>
                        </div>
                        <div>
                          <span className="text-green-400 font-bold">[Tên việc]</span>
                          <span className="text-slate-400">: Nội dung công việc cụ thể.</span>
                        </div>
                        <div>
                          <span className="text-amber-400 font-bold">[Tiến độ]</span>
                          <span className="text-slate-400">: % hoàn thành.</span>
                        </div>
                        <div>
                          <span className="text-red-400 font-bold">[Deadline]</span>
                          <span className="text-slate-400">: Hạn hoàn thành (17/2, "hôm nay", "ngày mai",...).</span>
                        </div>
                        <div>
                          <span className="text-purple-400 font-bold">[Trạng thái]</span>
                          <span className="text-slate-400">: Đang làm / Hoàn thành / Chờ duyệt / Tạm dừng.</span>
                          <div className="text-slate-400 italic text-xs mt-0.5">
                            (Nếu "hoàn thành" thì mặc định tiến độ 100% và deadline là hôm nay)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Cú pháp và ví dụ */}
                    <div className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
                       <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-700">
                        <h4 className="font-bold text-white text-sm uppercase">3. Cú pháp và ví dụ</h4>
                      </div>
                      <div className="p-3 space-y-6">
                        {/* Thêm mới */}
                        <div>
                          <div className="font-semibold text-white mb-2.5">
                             <div className="mb-1">
                                <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-xs uppercase border border-green-500/30">Thêm việc mới</span>
                             </div>
                             <div className="text-slate-400 text-xs font-normal">
                                Cú pháp: <span className="text-blue-300">[Dự án]</span> + <span className="text-green-400">[Tên việc]</span> + <span className="text-amber-400">[Tiến độ]</span> + <span className="text-red-400">[Deadline]</span>
                             </div>
                          </div>
                          <div className="bg-slate-900/50 p-2.5 rounded border border-green-700 text-xs">
                             <p className="italic text-slate-300 mb-1">
                                "<span className="text-blue-300">Dự án Lifecare</span> <span className="text-green-400">soạn hợp đồng</span> <span className="text-amber-400">đạt 50%</span>, <span className="text-red-400">deadline 14/2</span>."
                             </p>
                             <p className="italic text-slate-300">
                                "<span className="text-purple-400">Hoàn thành</span> <span className="text-green-400">đăng 10 post Facebook</span> <span className="text-blue-300">dự án Queency</span>."
                             </p>
                          </div>
                        </div>

                        {/* Cập nhật */}
                        <div>
                          <div className="font-semibold text-white mb-2.5">
                             <div className="mb-1">
                                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-xs uppercase border border-amber-500/30">Cập nhật việc cũ</span>
                             </div>
                             <div className="text-slate-400 text-xs font-normal">
                                Cú pháp: <span className="text-green-400">[Tên việc]</span> + <span className="text-amber-400">[Tiến độ mới]</span> hoặc <span className="text-purple-400">[Trạng thái mới]</span>
                             </div>
                          </div>
                          <div className="bg-slate-900/50 p-2.5 rounded border border-amber-300/50 text-xs">
                             <p className="italic text-slate-300 mb-1">
                                "Việc <span className="text-green-400">soạn hợp đồng</span> <span className="text-amber-400">tiến độ 90 phần trăm</span>."
                             </p>
                             <p className="italic text-slate-300">
                                "<span className="text-green-400">Soạn hợp đồng</span> <span className="text-amber-400">tiến độ 80%</span>, <span className="text-purple-400">đang chờ duyệt</span>."
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

          {/* Natural Language Note */}
          <div className="pt-4 mt-2 border-t border-slate-700">
            <p className="text-center text-slate-400 italic">
              * Bạn có thể nói/viết tự nhiên vì hệ thống sẽ tự hiểu, không cần theo thứ tự như cú pháp.<br/>* Khuyến khích báo cáo đủ thông tin trong <span className="font-semibold text-white">hướng dẫn chi tiết</span> để tiết kiệm thời gian chỉnh sửa.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
