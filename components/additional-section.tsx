"use client";

import { getDashboardEconosystem } from "@/src/features/ecosystem/api/api";
import { useEconosystemData } from "@/src/hooks/econosystemhook";
import { createRequestUser, personalRequest } from "@/src/services/api";
import {
    BookOpen,
    Zap,
    Lightbulb,
    Newspaper,
    Play,
    FileText,
    CheckCircle,
    ExternalLink,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";


export default function AdditionalSection() {
    const dispatch = useDispatch();
    const { listELearning, listTools, listCreative, listNews } =
        useEconosystemData();

    const [newRequest, setNewRequest] = useState({
        title: "",
        description: "",
    });

    const [showNewRequestModal, setShowNewRequestModal] = useState(false);

    useEffect(() => {
        const payloadELearning = {
            key: "listELearning",
            id: 1,
        };

        const payloadTools = {
            key: "listTools",
            id: 2,
        };

        const payloadCreative = {
            key: "listCreative",
            id: 3,
        };
        const payloadNews = {
            key: "listNews",
            id: 4,
        };
        dispatch(getDashboardEconosystem(payloadELearning) as any);
        dispatch(getDashboardEconosystem(payloadTools) as any);
        dispatch(getDashboardEconosystem(payloadCreative) as any);
        dispatch(getDashboardEconosystem(payloadNews) as any);
    }, []);

    const handleSubmitNewRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("userToken");
        if (!token) {
            toast.error("Bạn phải đăng nhập để thực hiện");
            setNewRequest({ title: "", description: "" });
            setShowNewRequestModal(false);
            return;
        }

        const payload = {
            token,
            title: newRequest.title,
            description: newRequest.description,
            type_request_id: 2,
        };

        try {
            const res = await dispatch(
                createRequestUser(payload as any) as any
            );
            if (res.payload.status === 200 || res.payload.status === 201) {
                toast.success(res.payload.data.message);
                await dispatch(personalRequest(payload as any) as any);
            }
        } catch (error) {
            console.log(error);
        }

        setNewRequest({ title: "", description: "" });
        setShowNewRequestModal(false);
    };
    return (
        <section
            style={{ boxShadow: "inset 0 0 10px rgba(122, 122, 122, 0.5)" }}
            className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8"
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="text-xs font-semibold uppercase  text-blue-950 sm:text-sm">
                        Các mục bổ sung
                    </div>
                    <h2 className="mt-2 text-2xl font-extrabold text-blue-main capitalize sm:text-3xl">
                        Hệ sinh thái hỗ trợ nội bộ
                    </h2>
                    <p className="mt-2 text-sm text-black">
                        Tăng tốc học tập, cộng tác và đổi mới với các trung tâm
                        dữ liệu nội bộ, công cụ làm việc nhanh và bản tin cập
                        nhật hàng tuần.
                    </p>
                </div>
            </div>
            <div className="mt-6 grid gap-5 sm:gap-6 xl:grid-cols-2">
                {/* Trung tâm đào tạo */}
                {listELearning?.map((item: any) => (
                    <div
                        key={item.id}
                        className="rounded-2xl bg-blue-gradiant-main bg-box-shadow p-5 sm:p-6"
                    >
                        <div className="flex items-center">
                            {/* <div
                                className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg`}
                            >
                                <BookOpen className="h-7 w-7 text-white" />
                            </div> */}
                            <div className="">
                                <div className="text-xs uppercase  font-semibold text-black">
                                    {item.name}
                                </div>
                                <h3 className="mt-2 text-xl font-extrabold text-blue-950">
                                    {item.description}
                                </h3>
                            </div>
                        </div>
                        <ul className="mt-4 space-y-2 text-sm text-slate-300">
                            {item.ecosystem_items.map((data: any) => (
                                <li
                                    key={data.id}
                                    className="flex flex-col gap-2 rounded-xl bg-box-shadow-inset bg-white px-4 py-2 transition  hover:bg-gray-400/40 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <span className="text-black">
                                        {data.title}
                                    </span>
                                    <span className="text-xs uppercase  text-black">
                                        {data.subtitle}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <button className="mt-4 w-full rounded-full bg-box-shadow bg-[#97cadb] py-3 text-sm font-bold uppercase  text-white transition hover:border-blue-800 hover:bg-[#7dc0d6] hover:text-black/30">
                            Truy cập E-Learning
                        </button>
                    </div>
                ))}

                {/* Công cụ làm việc */}
                {listTools?.map((item: any) => (
                    <div
                        key={item.id}
                        className="rounded-2xl bg-blue-gradiant-main bg-box-shadow p-5 sm:p-6"
                    >
                        <div className="flex items-center">
                            {/* <div
                                className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg`}
                            >
                                <Zap className="h-7 w-7 text-white" />
                            </div> */}
                            <div className="">
                                <div className="text-xs uppercase  font-semibold text-black">
                                    {item.name}
                                </div>
                                <h3 className="mt-2 text-xl font-extrabold text-blue-950">
                                    {item.description}
                                </h3>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {item.ecosystem_items.map((tool: any) => (
                                <a
                                    key={tool.id}
                                    href={tool.link}
                                    className="rounded-xl bg-box-shadow-inset bg-white px-4 py-3 text-left text-sm text-slate-200 transition hover:border-blue-500/40 hover:bg-gray-400/50 hover:text-black/30"
                                >
                                    <div className="font-semibold text-black">
                                        {tool.title}
                                    </div>
                                    <div className="text-xs uppercase  text-black">
                                        {tool.subtitle}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
                {/* Góc sáng tạo */}
                {listCreative?.map((item: any) => (
                    <div
                        key={item.id}
                        className="rounded-2xl bg-blue-gradiant-main bg-box-shadow p-5 sm:p-6"
                    >
                        <div className="flex items-center">
                            {/* <div
                                className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg`}
                            >
                                <Lightbulb className="h-7 w-7 text-white" />
                            </div> */}
                            <div className="">
                                <div className="text-xs uppercase font-semibold text-black">
                                    {item.name}
                                </div>
                                <h3 className="mt-2 text-xl font-extrabold text-blue-950">
                                    {item.description}
                                </h3>
                            </div>
                        </div>

                        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-black sm:pl-6">
                            {item.ecosystem_items.map((step: any) => (
                                <li key={step.id}>{step.title}</li>
                            ))}
                        </ol>

                        <button
                            className="mt-4 rounded-full bg-box-shadow bg-[#97cadb] px-5 py-2 text-sm font-semibold uppercase text-white transition hover:bg-[#7dc0d6] hover:text-black/30"
                            onClick={() => setShowNewRequestModal(true)}
                        >
                            Gửi sáng kiến
                        </button>

                        {showNewRequestModal && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-xl p-6 max-w-lg w-full">
                                    <h3 className="text-xl font-bold text-black mb-4">
                                        Gửi sáng kiến
                                    </h3>
                                    <form
                                        onSubmit={handleSubmitNewRequest}
                                        className="space-y-3"
                                    >
                                        <div>
                                            <label className="text-sm text-black">
                                                Tiêu đề
                                            </label>
                                            <input
                                                type="text"
                                                value={newRequest.title}
                                                onChange={(e) =>
                                                    setNewRequest({
                                                        ...newRequest,
                                                        title: e.target.value,
                                                    })
                                                }
                                                className="w-full mt-1 px-3 py-2 bg-white border border-slate-400 rounded text-black text-sm focus:border-blue-500 outline-none"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm text-black">
                                                Mô tả
                                            </label>
                                            <textarea
                                                value={newRequest.description}
                                                onChange={(e) =>
                                                    setNewRequest({
                                                        ...newRequest,
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full mt-1 px-3 py-2 bg-white border border-slate-400 rounded text-black text-sm focus:border-blue-500 outline-none"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2 mt-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowNewRequestModal(
                                                        false
                                                    );
                                                }}
                                                className="px-4 py-2 bg-black hover:bg-slate-700 text-white rounded-lg transition text-sm font-medium"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
                                            >
                                                Gửi yêu cầu
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {/* Bản tin tuần */}
                {listNews.map((item: any) => (
                    <div
                        key={item.id}
                        className="rounded-2xl bg-blue-gradiant-main bg-box-shadow p-5 sm:p-6"
                    >
                        <div className="">
                            {/* <div
                                className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg`}
                            >
                                <Newspaper className="h-7 w-7 text-white" />
                            </div> */}
                            <div className="">
                                <div className="text-xs uppercase font-semibold text-black">
                                    {item.name}
                                </div>
                                <h3 className="mt-2 text-xl font-extrabold text-blue-950">
                                    {item.description}
                                </h3>
                            </div>
                        </div>

                        {/* Container scroll riêng cho ecosystem_items */}
                        <div className="mt-4 max-h-64 overflow-y-auto space-y-3 text-sm text-slate-300">
                            {item.ecosystem_items?.map((subItem: any) => (
                                <a href={subItem.link} key={subItem.id}>
                                    <div className="rounded-xl bg-box-shadow-inset bg-white px-4 py-3 mt-3  mr-3 transition hover:bg-gray-400/50 hover:text-black/30">
                                        <div className="font-semibold text-black">
                                            {subItem.title}
                                        </div>
                                        <div className="text-xs text-black">
                                            {subItem.content}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
