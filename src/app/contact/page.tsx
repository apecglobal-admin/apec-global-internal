"use client";

import React, { useEffect, useState } from "react";
import {
    Phone,
    Mail,
    Clock,
    Send,
    User,
    MessageSquare,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { getContact, postContact } from "@/src/features/contact/api/api";
import { toast } from "react-toastify";
import { useContactData } from "@/src/hooks/contacthook";

export default function ContactPage() {
    const dispatch = useDispatch();
    const { listContact } = useContactData();
    
    useEffect(() => {
        if(listContact.length !== 0) return;
        const payload = {}
        dispatch(getContact(payload) as any);
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        title: "",
        content: "",
    });

    const [error, setError] = useState({
        name: "",
        email: "",
        phone: "",
        title: "",
        content: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        
        // Clear error khi user nhập lại
        if (error[name as keyof typeof error]) {
            setError({
                ...error,
                [name]: "",
            });
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        // Reset errors
        setError({
            name: "",
            email: "",
            phone: "",
            title: "",
            content: "",
        });

        const res = await dispatch(postContact(formData) as any);
        console.log(res);
        
        if (res.payload.status === 201 || res.payload.status === 200) {
            toast.success(res.payload.data.message);
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    title: "",
                    content: "",
                });
            }, 3000);
        } else {
            // Xử lý lỗi validation
            const errorData = res.payload.errors;
            if (Array.isArray(errorData)) {
                // Nếu có nhiều lỗi
                const newErrors: any = { ...error };
                errorData.forEach((err: any) => {
                    if (err.path && err.msg) {
                        newErrors[err.path] = err.msg;
                    }
                });
                setError(newErrors);
            } else if (errorData.path && errorData.msg) {
                // Nếu chỉ có 1 lỗi
                setError({
                    ...error,
                    [errorData.path]: errorData.msg,
                });
                toast.error(errorData.msg);
            } else {
                // Lỗi chung
                toast.error(errorData.message || "Có lỗi xảy ra!");
            }
        }
    };

    // Helper function để lấy thông tin contact theo title
    const getContactInfo = (title: string) => {
        return listContact?.find((item: any) => item.title === title);
    };

    const hotlineInfo = getContactInfo("Hotline");
    const emailInfo = getContactInfo("Email");
    const workTimeInfo = getContactInfo("Giờ Làm Việc");

    // Helper function để format thời gian
    const formatTime = (time: string) => {
        if (!time) return "";
        return time.substring(0, 5); // Lấy HH:MM từ HH:MM:SS
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <section className="pt-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-3xl font-bold mb-12 text-center text-slate-900">
                        Liên Hệ Với Chúng Tôi
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Hotline Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 bg-box-shadow rounded-xl p-8 text-center hover:shadow-xl hover:border-blue-400 transition">
                            <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl mb-2 text-slate-900">
                                {hotlineInfo?.title || "Hotline"}
                            </h4>
                            <p className="text-slate-700 mb-2 font-medium">
                                {hotlineInfo?.content || "1900-xxxx"}
                            </p>
                            {hotlineInfo?.start_time && hotlineInfo?.end_time && (
                                <p className="text-slate-600 text-sm">
                                    {formatTime(hotlineInfo.start_time)} - {formatTime(hotlineInfo.end_time)} hàng ngày
                                </p>
                            )}
                        </div>

                        {/* Email Card */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 bg-box-shadow rounded-xl p-8 text-center hover:shadow-xl hover:border-purple-400 transition">
                            <div className="w-16 h-16 bg-purple-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl mb-2 text-slate-900">
                                {emailInfo?.title || "Email"}
                            </h4>
                            <p className="text-slate-700 mb-2 font-medium break-all">
                                {emailInfo?.content || "support@example.com"}
                            </p>
                            {emailInfo?.start_time && emailInfo?.end_time && (
                                <p className="text-slate-600 text-sm">
                                    Phản hồi trong 24h
                                </p>
                            )}
                        </div>

                        {/* Giờ Làm Việc Card */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 bg-box-shadow rounded-xl p-8 text-center hover:shadow-xl hover:border-green-400 transition">
                            <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl mb-2 text-slate-900">
                                {workTimeInfo?.title || "Giờ Làm Việc"}
                            </h4>
                            {workTimeInfo?.work_day_from && workTimeInfo?.work_day_to && (
                                <p className="text-slate-700 mb-2 font-medium">
                                    {workTimeInfo.work_day_from} - {workTimeInfo.work_day_to}
                                </p>
                            )}
                            {workTimeInfo?.start_time && workTimeInfo?.end_time && (
                                <p className="text-slate-600 text-sm">
                                    {formatTime(workTimeInfo.start_time)} - {formatTime(workTimeInfo.end_time)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 px-4 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-white bg-box-shadow rounded-xl p-8 shadow-lg">
                            <h3 className="text-2xl font-bold mb-6 text-slate-900">
                                Gửi Tin Nhắn
                            </h3>

                            {submitted && (
                                <div className="mb-6 p-4 bg-green-50 border-2 border-green-400 rounded-lg text-green-700 font-medium">
                                    ✓ Tin nhắn của bạn đã được gửi thành công!
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-700">
                                        Họ và Tên *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-lg text-black ${
                                                error.name 
                                                    ? "border-red-400 focus:border-red-500" 
                                                    : "border-slate-200 focus:border-blue-400"
                                            }`}
                                            placeholder="Nguyễn Văn A"
                                        />
                                    </div>
                                    {error.name && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <span className="text-red-500">⚠</span>
                                            {error.name}
                                        </p>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700">
                                            Email *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-lg text-black ${
                                                    error.email 
                                                        ? "border-red-400 focus:border-red-500" 
                                                        : "border-slate-200 focus:border-blue-400"
                                                }`}
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        {error.email && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <span className="text-red-500">⚠</span>
                                                {error.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700">
                                            Số Điện Thoại
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-lg text-black ${
                                                    error.phone 
                                                        ? "border-red-400 focus:border-red-500" 
                                                        : "border-slate-200 focus:border-blue-400"
                                                }`}
                                                placeholder="0123 456 789"
                                            />
                                        </div>
                                        {error.phone && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <span className="text-red-500">⚠</span>
                                                {error.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-700">
                                        Chủ Đề *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-lg text-black ${
                                            error.title 
                                                ? "border-red-400 focus:border-red-500" 
                                                : "border-slate-200 focus:border-blue-400"
                                        }`}
                                        placeholder="Vấn đề cần hỗ trợ"
                                    />
                                    {error.title && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <span className="text-red-500">⚠</span>
                                            {error.title}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-700">
                                        Nội Dung *
                                    </label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                                        <textarea
                                            name="content"
                                            value={formData.content}
                                            onChange={handleChange}
                                            rows={5}
                                            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-lg resize-none text-black ${
                                                error.content 
                                                    ? "border-red-400 focus:border-red-500" 
                                                    : "border-slate-200 focus:border-blue-400"
                                            }`}
                                            placeholder="Nhập nội dung tin nhắn của bạn..."
                                        />
                                    </div>
                                    {error.content && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <span className="text-red-500">⚠</span>
                                            {error.content}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                >
                                    <Send className="w-5 h-5" />
                                    Gửi Tin Nhắn
                                </button>
                            </form>
                        </div>

                        <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.8175700973475!2d106.62393677451695!3d10.748539059708584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752dd5215d18ef%3A0x447357ebb780b687!2zNCBMw6ogVHXDosyBbiBNw6LMo3UsIFBoxrDhu51uZyAxMywgUXXhuq1uIDYsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1763367128264!5m2!1sen!2s"
                                width="600"
                                height="100%"
                                loading="lazy"
                                className="w-full"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}