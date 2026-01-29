"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Phone, Briefcase, MapPin, Send, MessageSquare, UserCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

// Redux & API
import { getListProject } from "@/src/features/project/api/api";
import { useProjectData } from "@/src/hooks/projecthook";
import { AppDispatch } from "@/src/lib/store"; // Assuming AppDispatch is exported from store, or use any if not available

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Position options
const POSITIONS = [
  "Nhân viên",
  "Trưởng nhóm",
  "Phó phòng",
  "Trưởng phòng",
  "Giám đốc khối",
  "Khác",
];

const formSchema = z.object({
  // Section 1: Reporter Info
  name: z.string().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  employeeId: z.string().min(1, "Vui lòng nhập mã số nhân viên/số hiệu"),
  position: z.string().optional(),
  project: z.string().optional(),
  area: z.string().optional(),

  // Section 2: Complain Content
  content: z.string().min(1, "Vui lòng nhập nội dung phản ảnh"),
  subject: z.string().optional(), // Object/Person being reported
});

type FormValues = z.infer<typeof formSchema>;

interface FieldConfig {
  name: keyof FormValues;
  label: string;
  type: "input" | "select" | "textarea";
  required?: boolean;
  placeholder?: string;
  icon?: React.ElementType;
  options?: string[];
}

const CONTENT_FIELDS: FieldConfig[] = [
  { name: "subject", label: "Người / Sự việc / Đối tượng bị phản ảnh", type: "input", placeholder: "VD: Quy trình X, Bộ phận Y,..." },
  { name: "content", label: "Nội dung chi tiết", type: "textarea", required: true, placeholder: "Mô tả chi tiết sự việc..." },
];

export default function ComplainPage() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>(); // Type dispatch if possible
  const { listProject } = useProjectData();

  // Fetch projects on mount
  useEffect(() => {
    // Only fetch if data is not already available or if we want fresh data.
    // Based on userSlice/projectSlice behavior, we might want to check if it's already loaded.
    // Here we strictly follow the plan to dispatch it.
    dispatch(getListProject({ search: "", project_status: null }) as any);
  }, [dispatch]);

  // Construct dynamic fields
  // Prepare project options from the fetched list
  const projectOptions = Array.from(new Set(listProject?.map((p: any) => p.name) || []));

  const reporterFields: FieldConfig[] = [
    { name: "name", label: "Họ và Tên", type: "input", required: true, icon: User, placeholder: "Nguyễn Văn A" },
    { name: "phone", label: "Số điện thoại", type: "input", required: true, icon: Phone, placeholder: "09xxxxxxx" },
    { name: "employeeId", label: "Mã số nhân viên / Số hiệu", type: "input", required: true, icon: Briefcase, placeholder: "VD: 12345" },
    { name: "position", label: "Chức vụ", type: "select", options: POSITIONS, placeholder: "Chọn chức vụ" },
    { name: "project", label: "Dự án / Công ty", type: "select", options: projectOptions.length > 0 ? projectOptions : ["Khác"], placeholder: "Chọn dự án/công ty" },
    { name: "area", label: "Khu vực", type: "input", icon: MapPin, placeholder: "VD: Dĩ An" },
  ];

  // Placeholder URL
  const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby-xWKwp0zSqBdGZ2yCnqrNzFrbAqkOmbyn05KEnjzsCPLyJkhcddZOjws0WOIfARfB/exec";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      employeeId: "",
      position: "",
      project: "",
      area: "",
      content: "",
      subject: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      // Mock submission or keep existing webhook logic
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(data),
      });

      toast.success("Cảm ơn bạn đã gửi phản ảnh! Chúng tôi sẽ ghi nhận sớm nhất.");
      form.reset();
    } catch (error) {
      console.error("Error submitting complain:", error);
      toast.error("Có lỗi xảy ra khi gửi phản ảnh. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (config: FieldConfig) => {
    return (
      <FormField
        key={config.name}
        control={form.control}
        name={config.name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-900 font-semibold">
              {config.label} {config.required && <span className="text-red-600">*</span>}
            </FormLabel>
            <FormControl>
              {config.type === "select" ? (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="text-slate-900 w-full min-w-0 border-slate-600 [&>[data-slot=select-value]]:truncate [&>[data-slot=select-value]]:min-w-0 [&>[data-slot=select-value]]:flex-1 [&>[data-slot=select-value]]:text-left">
                    <SelectValue placeholder={config.placeholder} />
                  </SelectTrigger>
                  <SelectContent className="max-w-[var(--radix-select-trigger-width)]">
                    {config.options?.map((opt) => (
                      <SelectItem key={opt} value={opt} className="text-slate-200 whitespace-normal h-auto py-2">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : config.type === "textarea" ? (
                <Textarea
                  placeholder={config.placeholder}
                  className="min-h-[120px] sm:min-h-[150px] resize-y text-slate-900"
                  {...field}
                />
              ) : (
                <div className="relative">
                  {config.icon && (
                    <config.icon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  )}
                  <Input
                    placeholder={config.placeholder}
                    className={`${config.icon ? "pl-9" : ""} text-slate-900`}
                    {...field}
                  />
                </div>
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Cổng Thông Tin Phản Ảnh
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-700 font-medium">
            Nơi tiếp nhận mọi kiến nghị và phản ảnh từ CBNV
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            
            {/* SECTION 1: Reporter Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-blue-100/50 px-4 py-3 sm:px-6 sm:py-4 border-b border-blue-100 flex items-center gap-3">
                <UserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
                <h2 className="text-base sm:text-lg font-bold text-blue-900">Thông tin người phản ảnh</h2>
              </div>
              
              <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {reporterFields.map(renderField)}
              </div>
            </div>

            {/* SECTION 2: Complain Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="bg-amber-100/50 px-4 py-3 sm:px-6 sm:py-4 border-b border-amber-100 flex items-center gap-3">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />
                <h2 className="text-base sm:text-lg font-bold text-amber-900">Nội dung phản ảnh</h2>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {CONTENT_FIELDS.map(renderField)}
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex justify-center pt-2 md:pt-0">
               <Button 
                type="submit" 
                size="lg" 
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 min-w-[200px] font-bold text-white shadow-md hover:shadow-lg transition-all"
              >
                {loading ? "Đang gửi..." : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Gửi phản ảnh
                  </>
                )}
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}
