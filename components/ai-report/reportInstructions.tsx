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
                    A. TÓM TẮT NHANH
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
                    <div className="text-sm">
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
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-400/50">
                    <div className="text-blue-300 font-semibold mb-2">
                      2. Báo cáo công việc khác:
                    </div>
                    <div className="text-sm">
                      <div className="text-slate-300 pl-3 mb-1">
                        Cú pháp:{" "}
                        <span className="text-green-400">[Tên việc]</span>
                      </div>
                      <div className="text-slate-400 pl-3 text-xs italic">
                        Ví dụ: "
                        <span className="text-green-400">Soạn hợp đồng</span>"
                        <br />
                        Ví dụ: "
                        <span className="text-green-400">
                          Khảo sát cửa hàng
                        </span>
                        <span className="text-white"> 60%</span>"
                        <br />
                        Ví dụ: "<span className="text-white">Hoàn thành </span>
                        <span className="text-green-400">Gặp đối tác</span>"
                        <br />
                        Ví dụ thêm việc con cho 1 việc cha cụ thể: "
                        <span className="text-white">Trong </span>
                        <span className="text-green-400">Quản lý tài liệu</span>
                        <span className="text-white"> thêm </span>
                        <span className="text-green-400">Soạn hợp đồng</span>
                        "
                        <br />
                        Ví dụ: "<span className="text-white">Trong </span>
                        <span className="text-green-400">
                          Nhật ký ngày tháng 3
                        </span>
                        <span className="text-white">
                          {" "}
                          hoàn thành tất cả việc con
                        </span>
                        "
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
                      className={`flex-1 rounded-t-lg rounded-b-none border-t border-x py-3 font-bold transition-all duration-200 mb-[-1px] z-10 relative
                        ${
                          activeTab === "nam-thien-long"
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
                        ${
                          activeTab === "cong-viec-khac"
                            ? "bg-slate-900 border-blue-500 border-b-slate-900 text-blue-500 hover:text-blue-400"
                            : "bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                        }
                      `}
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
                    <TabsContent
                      value="nam-thien-long"
                      className="mt-0 space-y-4"
                    >
                      {/* Section 1: Thông tin cần báo cáo */}
                      <div className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
                        <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-700">
                          <h4 className="font-bold text-white text-sm uppercase">
                            1. Thông tin cần báo cáo
                          </h4>
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
                              Mặc định là hôm nay. Nếu báo cáo cho ngày khác
                              phải nói rõ (Vd: "Hôm qua", "Ngày 25/1").
                            </li>
                            <li>
                              <strong className="text-white">
                                Các thông tin thêm:
                              </strong>{" "}
                              Ra quân, rút quân, tăng/giảm vị trí, nhân sự
                              mới/nghỉ, vi phạm,... (nếu không nhắc đến thì mặc
                              định là 0).
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Section 2: Ví dụ mẫu */}
                      <div className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
                        <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-700">
                          <h4 className="font-bold text-white text-sm uppercase">
                            2. Ví dụ
                          </h4>
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

                    <TabsContent
                      value="cong-viec-khac"
                      className="mt-0 space-y-4"
                    >
                      {/* Section 1: Cách hoạt động */}
                      <div className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
                        <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-700">
                          <h4 className="font-bold text-white text-sm uppercase">
                            1. Cách hoạt động
                          </h4>
                        </div>

                        <div className="p-3 space-y-2 text-slate-300 text-sm">
                          <div className="space-y-3">
                            <div>
                              <div className="mb-2 text-slate-200 font-medium">
                                Hệ thống tự động so khớp{" "}
                                <span className="text-green-400 font-semibold">
                                  tên công việc
                                </span>{" "}
                                bạn cung cấp theo thứ tự:
                              </div>
                              <ul className="list-decimal pl-5 space-y-1 text-slate-300">
                                <li>
                                  Tìm{" "}
                                  <span className="text-white font-semibold">
                                    việc cha
                                  </span>{" "}
                                  → nếu khớp: cập nhật việc cha
                                </li>
                                <li>
                                  Tìm{" "}
                                  <span className="text-white font-semibold">
                                    việc con
                                  </span>{" "}
                                  → nếu khớp: cập nhật việc con
                                </li>
                                <li>
                                  Không khớp → tự động{" "}
                                  <span className="text-white font-semibold">
                                    thêm việc con mới
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <p className="italic text-amber-400 text-xs">
                            * Có thể báo cáo nhiều việc 1 lần.
                          </p>
                          <p className="text-slate-400 italic text-xs">
                            <strong>* Mẹo:</strong> Nên nói kèm tên cha: &quot;
                            <strong>[Việc con]</strong> thuộc{" "}
                            <strong>[Nhiệm vụ cha]</strong>&quot;
                            <br />
                            (VD:
                            <span className="text-slate-400 italic">
                              {" "}
                              "<strong>
                                Gửi báo giá khách hàng
                              </strong> thuộc{" "}
                              <strong>Chăm sóc khách hàng</strong>"
                            </span>
                            ).
                          </p>
                        </div>
                      </div>

                      {/* Section 2: Các phần thông tin */}
                      <div className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
                        <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-700">
                          <h4 className="font-bold text-white text-sm uppercase">
                            2. Thông tin có thể cung cấp
                          </h4>
                        </div>
                        <div className="p-3 space-y-3 text-sm">
                          {/* Nhiệm vụ cha */}
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
                                  : Tên nhiệm vụ cha trong hệ thống.
                                </span>
                              </div>
                              <div>
                                <span className="text-amber-400 font-bold">
                                  [Giá trị đạt được]
                                </span>
                                <span className="text-slate-400">
                                  : Tiến độ công việc (doanh thu, số lần, %).
                                </span>
                              </div>
                              <div>
                                <span className="text-purple-400 font-bold">
                                  [Trạng thái]
                                </span>
                                <span className="text-slate-400">
                                  : Đang thực hiện / Tạm dừng / Hoàn thành /
                                  Hủy.
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Việc con */}
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
                                  : Nội dung công việc cụ thể.
                                </span>
                              </div>
                              <div>
                                <span className="text-amber-400 font-bold">
                                  [Tiến độ]
                                </span>
                                <span className="text-slate-400">
                                  : % hoàn thành (0–100).
                                </span>
                              </div>
                              <div>
                                <span className="text-purple-400 font-bold">
                                  [Trạng thái]
                                </span>
                                <span className="text-slate-400">
                                  : Đang thực hiện / Tạm dừng / Hoàn thành /
                                  Hủy.
                                </span>
                              </div>
                            </div>
                            <div className="text-slate-400 italic text-xs mt-1.5 pl-2">
                              * Nếu nói &quot;hoàn thành&quot; → tự đặt tiến độ
                              100%. Ngược lại, tiến độ 100% → tự chuyển hoàn
                              thành.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Cú pháp và ví dụ */}
                      <div className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
                        <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-700">
                          <h4 className="font-bold text-white text-sm uppercase">
                            3. Ví dụ
                          </h4>
                        </div>
                        <div className="p-3 space-y-5">
                          {/* Cập nhật nhiệm vụ cha */}
                          <div>
                            <div className="font-semibold text-white mb-2">
                              <div className="mb-1">
                                <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs uppercase border border-blue-500/30">
                                  Cập nhật nhiệm vụ cha
                                </span>
                              </div>
                              <div className="text-slate-400 text-xs font-normal">
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
                            <div className="bg-slate-900/50 p-2.5 rounded border border-blue-700/50 text-xs">
                              <p className="italic text-slate-300 mb-1">
                                &quot;
                                <span className="text-green-400">
                                  Doanh thu
                                </span>{" "}
                                đạt{" "}
                                <span className="text-amber-400">50 triệu</span>
                                .&quot;
                              </p>
                              <p className="italic text-slate-300">
                                &quot;
                                <span className="text-green-400">
                                  Xử lý việc
                                </span>{" "}
                                được{" "}
                                <span className="text-amber-400">3 lần</span>,{" "}
                                <span className="text-purple-400">
                                  hoàn thành
                                </span>
                                .&quot;
                              </p>
                            </div>
                          </div>

                          {/* Thêm việc con mới */}
                          <div>
                            <div className="font-semibold text-white mb-2">
                              <div className="mb-1">
                                <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-xs uppercase border border-green-500/30">
                                  Thêm việc con mới
                                </span>
                              </div>
                              <div className="text-slate-400 text-xs font-normal">
                                Cú pháp:{" "}
                                <span className="text-green-400">
                                  [Tên việc mới]
                                </span>{" "}
                                (thuộc{" "}
                                <span className="text-blue-400">
                                  [Nhiệm vụ cha]
                                </span>
                                ) + (
                                <span className="text-amber-400">
                                  [Tiến độ]
                                </span>
                                )
                              </div>
                            </div>
                            <div className="bg-slate-900/50 p-2.5 rounded border border-green-700/50 text-xs">
                              <p className="italic text-slate-300 mb-1">
                                &quot;
                                <span>Thêm </span>
                                <span className="text-green-400">
                                  soạn hợp đồng
                                </span>{" "}
                                <span>thuộc </span>
                                <span className="text-blue-400">
                                  Quản lý tài liệu
                                </span>
                                ,{" "}
                                <span className="text-amber-400">đạt 50%</span>
                                .&quot;
                              </p>
                              <p className="italic text-slate-300">
                                &quot;
                                <span className="text-purple-400">
                                  Hoàn thành
                                </span>{" "}
                                <span className="text-green-400">
                                  đăng 10 post Facebook
                                </span>
                                .&quot;
                              </p>
                            </div>
                          </div>

                          {/* Cập nhật việc con */}
                          <div>
                            <div className="font-semibold text-white mb-2">
                              <div className="mb-1">
                                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-xs uppercase border border-amber-500/30">
                                  Cập nhật việc con
                                </span>
                              </div>
                              <div className="text-slate-400 text-xs font-normal">
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
                            </div>
                            <div className="bg-slate-900/50 p-2.5 rounded border border-amber-300/50 text-xs">
                              <p className="italic text-slate-300 mb-1">
                                &quot;
                                <span>Cập nhật</span>{" "}
                                <span className="text-green-400">
                                  soạn hợp đồng
                                </span>{" "}
                                <span className="text-amber-400">
                                  tiến độ 90%
                                </span>
                                .&quot;
                              </p>
                              <p className="italic text-slate-300">
                                &quot;
                                <span className="text-green-400">
                                  Soạn hợp đồng
                                </span>{" "}
                                <span className="text-purple-400">
                                  tạm dừng
                                </span>
                                .&quot;
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
              * Bạn có thể nói/viết tự nhiên vì hệ thống sẽ tự hiểu, không cần
              theo thứ tự như cú pháp.
              <br />* Khuyến khích báo cáo đủ thông tin trong{" "}
              <span className="font-semibold text-white">
                hướng dẫn chi tiết
              </span>{" "}
              để tiết kiệm thời gian chỉnh sửa.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
