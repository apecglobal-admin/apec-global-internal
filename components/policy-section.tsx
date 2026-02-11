"use client";

import { FileText, PenTool, Search } from "lucide-react";
import SearchBar from "./searchBar";
import { colorClasses, colorMap } from "@/src/utils/color";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { usePolicyData } from "@/src/hooks/policyhook";
import { getListPolicy, getStatPolicy } from "@/src/features/policy/api/api";
import { Spinner } from "./ui/spinner";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

const IMAGE_EXTENSIONS = [
    "jpg", "jpeg", "png", "gif",
    "webp", "bmp", "svg", "ico",
    "tiff", "avif"
];

export default function PolicySection() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const dispatch = useDispatch();

    const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const { statPolicy, listPolicy, isLoadingStatPolicy, isLoadingListPolicy } = usePolicyData();

    useEffect(() => {
        dispatch(getStatPolicy() as any);
    }, []);

    useEffect(() => {
        const fetchApi = async () => {
            const payload = {
                filter: searchQuery,
            };

            await dispatch(getListPolicy(payload) as any);
        };
        fetchApi();
    }, [searchQuery]);

    const handleChange = (value: string) => {
        setSearchQuery(value);
    };

    if(isLoadingStatPolicy){
        return(
            <section
                style={{ boxShadow: "inset 0 0 10px rgba(122, 122, 122, 0.5)" }}
                className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8"
            >
                <Spinner text="đang load dữ liệu"/>
            </section>
        )
    }

    const handleShowDetail = (policy: any) => {
        setSelectedPolicy(policy);
        setOpenDialog(true);
    };
    
    const getViewerUrl = (url: string, fileName: string) => {
        const extension = fileName.split(".").pop()?.toLowerCase();
      
        if (!extension) return url;
      
        if (IMAGE_EXTENSIONS.includes(extension)) {
          return url
            .replace("/raw/upload/", "/image/upload/")
            .replace("/fl_attachment", "");
        }
      
        if (extension === "pdf") {
          return url.replace("/fl_attachment", "");
        }
      
        return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
          url.replace("/fl_attachment", "")
        )}`;
      };

    return (
        <section
            style={{ boxShadow: "inset 0 0 10px rgba(122, 122, 122, 0.5)" }}
            className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8"
        >
            <div className="space-y-8">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="text-xs font-semibold uppercase  text-blue-950 sm:text-sm">
                            Chính sách nội bộ
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-2xl font-extrabold text-blue-main capitalize sm:text-3xl">
                                Kho chính sách tập trung
                            </h2>
                            <p className="text-sm text-black">
                                Tra cứu nhanh, tải tài liệu chuẩn hóa và ký nhận
                                điện tử trên từng chính sách để đảm bảo tuân thủ
                                đồng nhất toàn hệ thống.
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                        {statPolicy.map((stat: any, index: number) => {
                            const colorClass =
                                colorClasses[index % colorClasses.length];
                            const borderColor =
                                colorMap[colorClass] || "#FACC15";

                            return (
                                <div
                                    key={stat.label}
                                    className={`group rounded-2xl border-l-6 bg-white p-5 shadow-inner shadow-black/10 transition bg-blue-gradiant-main`}
                                    style={{
                                        borderLeftColor: borderColor,
                                        boxShadow:
                                            "0 0 10px rgba(0, 0, 0, 0.3)",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.boxShadow = `0 0 20px ${borderColor}80`)
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.boxShadow = `0 0 10px rgba(0, 0, 0, 0.3)`)
                                    }
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div
                                                className={`text-3xl font-bold ${colorClass}`}
                                            >
                                                {stat.value}
                                            </div>
                                            <div
                                                className={`mt-1 text-lg uppercase   font-semibold ${colorClass}`}
                                            >
                                                {stat.label}
                                            </div>
                                            <div className="text-[11px] text-black">
                                                {stat.subLabel}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <SearchBar
                    placeholder="Tìm kiếm chính sách, biểu mẫu..."
                    onChange={handleChange}
                />

                {isLoadingListPolicy && (
                    <section
                        style={{ boxShadow: "inset 0 0 10px rgba(122, 122, 122, 0.5)" }}
                        className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8"
                    >
                        <Spinner text="đang load dữ liệu"/>
                    </section>
                )}
                {!isLoadingListPolicy && (
                    <div className="space-y-6">
                        {listPolicy && listPolicy.map((group: any, groupIndex: number) => {
                            const hasPolicies =
                                Array.isArray(group.policies) &&
                                group.policies.length > 0;

                            return (
                                <article
                                    key={groupIndex}
                                    className="relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-box-shadow p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                                >

                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-4">
                                            <h2 className="text-xl font-extrabold text-blue-main capitalize sm:text-2xl">
                                                {group.name}
                                            </h2>
                                            <span className="rounded-full bg-orange-400 border border-orange-500 px-3 py-1 text-xs font-semibold text-white">
                                                {hasPolicies
                                                    ? `${group.policies.length} tài liệu`
                                                    : "0 tài liệu"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-black/80">
                                            {group.description}
                                        </p>
                                    </div>


                                    {hasPolicies ? (
                                        <ul className="space-y-2">
                                            {group.policies.map(
                                                (policy: any, index: number) => (
                                                    <div
                                                        onClick={() => handleShowDetail(policy)}
                                                        key={policy.id || `${groupIndex}-${index}`}
                                                        className="cursor-pointer flex flex-col gap-3 rounded-2xl bg-white px-4 py-3 bg-box-shadow transition hover:bg-gray-100 sm:flex-row sm:items-center sm:justify-between"
                                                    >

                                                        <div className="flex items-center gap-3">
                                                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-xs font-semibold text-white">
                                                                {String(
                                                                    index + 1
                                                                ).padStart(2, "0")}
                                                            </span>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-bold text-black">
                                                                        {
                                                                            policy.title
                                                                        }
                                                                    </span>
                                                                    {policy.status ===
                                                                        "new" && (
                                                                        <span className="items-center rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                                                                            Mới
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-xs text-black">
                                                                    {
                                                                        policy.description
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs uppercase  transition text-orange-600">
                                                            <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold hover:bg-orange-100">
                                                                Xem chi tiết{" "}
                                                                <span aria-hidden>
                                                                    ↗
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-gray-400 bg-gray-50 p-4 text-sm text-gray-600 italic">
                                            Chưa có tài liệu nào được cập nhật cho
                                            nhóm này.
                                        </div>
                                    )}
                                </article>
                            );
                        })}

                        {listPolicy.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-slate-700 bg-blue-gradiant-main px-5 py-10 text-center text-slate-400 sm:px-6 sm:py-12">
                                Không có chính sách nào cho bộ lọc hiện tại.
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="bg-white">
                    {selectedPolicy && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold text-black">
                                    {selectedPolicy.title}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="mt-6 space-y-4">
                                <div className="text-sm text-gray-700 leading-relaxed">
                                    <p>{selectedPolicy.description}</p>
                                </div>

                                {selectedPolicy.documents?.length > 0 && (
                                    <div className="border-t pt-4 mt-4">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                            Tài liệu đính kèm ({selectedPolicy.documents.length})
                                        </h4>

                                        <div className="space-y-2">
                                            {selectedPolicy.documents.map((doc: any) => (
                                                <a
                                                    key={doc.id}
                                                    href={getViewerUrl(doc.file_url, doc.name)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition"
                                                >
                                                    <FileText className="w-5 h-5 text-green-600" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {doc.name}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="mt-6">
                                <DialogClose asChild>
                                    <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors">
                                        Đóng
                                    </button>
                                </DialogClose>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

        </section>
    );
}
