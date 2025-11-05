"use client"

import React, { useState } from 'react';
import { Search, MessageCircle, Book, HelpCircle, Mail, Phone, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "Làm thế nào để tạo tài khoản?",
      answer: "Bạn có thể tạo tài khoản bằng cách nhấp vào nút 'Đăng ký' ở góc trên cùng bên phải. Điền thông tin email, mật khẩu và xác nhận qua email để hoàn tất quá trình đăng ký."
    },
    {
      id: 2,
      question: "Tôi quên mật khẩu, phải làm sao?",
      answer: "Nhấp vào 'Quên mật khẩu' trên trang đăng nhập. Nhập email đã đăng ký và chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến hộp thư của bạn."
    },
    {
      id: 3,
      question: "Làm thế nào để liên hệ hỗ trợ khách hàng?",
      answer: "Bạn có thể liên hệ với chúng tôi qua email support@example.com, gọi hotline 1900-xxxx hoặc sử dụng tính năng chat trực tuyến có sẵn trên trang web."
    },
    {
      id: 4,
      question: "Thời gian xử lý yêu cầu hỗ trợ là bao lâu?",
      answer: "Chúng tôi cam kết phản hồi trong vòng 24 giờ làm việc. Các yêu cầu khẩn cấp sẽ được ưu tiên xử lý trong vòng 2-4 giờ."
    },
    {
      id: 5,
      question: "Có hỗ trợ tiếng Việt không?",
      answer: "Có, chúng tôi cung cấp hỗ trợ đầy đủ bằng tiếng Việt qua tất cả các kênh: email, điện thoại và chat trực tuyến."
    }
  ];

  const categories = [
    {
      icon: <Book className="w-8 h-8" />,
      title: "Hướng Dẫn Sử Dụng",
      description: "Tài liệu chi tiết về cách sử dụng các tính năng",
      link: "#"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Chat Trực Tuyến",
      description: "Trò chuyện ngay với đội ngũ hỗ trợ",
      link: "#"
    },
    {
      icon: <HelpCircle className="w-8 h-8" />,
      title: "Câu Hỏi Thường Gặp",
      description: "Tìm câu trả lời cho các câu hỏi phổ biến",
      link: "#faq"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Gửi Email",
      description: "Liên hệ qua email để được hỗ trợ chi tiết",
      link: "#"
    }
  ];

  const toggleFaq = (id: any) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <Header/>

      {/* Categories Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Danh Mục Hỗ Trợ</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <a
                key={index}
                href={category.link}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500 hover:bg-slate-800 transition duration-300 group"
              >
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h4 className="text-xl font-semibold mb-2">{category.title}</h4>
                <p className="text-slate-400 text-sm">{category.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Câu Hỏi Thường Gặp</h3>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-750 transition"
                >
                  <span className="font-semibold text-left">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-5 text-slate-300 border-t border-slate-700 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Liên Hệ Với Chúng Tôi</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center hover:border-blue-500 transition">
              <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Hotline</h4>
              <p className="text-slate-300 mb-2">1900-xxxx</p>
              <p className="text-slate-500 text-sm">8:00 - 22:00 hàng ngày</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center hover:border-blue-500 transition">
              <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Email</h4>
              <p className="text-slate-300 mb-2">support@example.com</p>
              <p className="text-slate-500 text-sm">Phản hồi trong 24h</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center hover:border-blue-500 transition">
              <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Giờ Làm Việc</h4>
              <p className="text-slate-300 mb-2">Thứ 2 - Chủ Nhật</p>
              <p className="text-slate-500 text-sm">8:00 - 22:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}