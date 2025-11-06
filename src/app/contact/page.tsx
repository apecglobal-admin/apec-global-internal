"use client"

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, User, MessageSquare, Search, MessageCircle, Book, HelpCircle,  ChevronDown, ChevronUp  } from 'lucide-react';

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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);



  const toggleFaq = (id: any) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
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
      <section className="pt-16 px-4">
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

      {/* Main Content: Form + Map */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Gửi Tin Nhắn</h3>
              
              {submitted && (
                <div className="mb-6 p-4 bg-green-600 bg-opacity-20 border border-green-500 rounded-lg text-green-400">
                  ✓ Tin nhắn của bạn đã được gửi thành công!
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Họ và Tên *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">
                      Số Điện Thoại
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0123 456 789"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Chủ Đề *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Vấn đề cần hỗ trợ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Nội Dung *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                    ></textarea>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Gửi Tin Nhắn
                </button>
              </div>
            </div>

            {/* Google Map + Office Hours */}
            <div className="space-y-6">
              {/* Google Map */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.8176385425418!2d106.62393677480448!3d10.74853378939854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752dd5215d18ef%3A0x447357ebb780b687!2zNCBMw6ogVHXDosyBbiBNw6LMo3UsIFBoxrDhu51uZyAxMywgUXXhuq1uIDYsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1762314542648!5m2!1svi!2s"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                ></iframe>
              </div>

              {/* Office Hours */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Giờ Làm Việc</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-300">Thứ Hai - Thứ Sáu</span>
                    <span className="text-blue-400 font-semibold">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-300">Thứ Bảy</span>
                    <span className="text-blue-400 font-semibold">9:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-300">Chủ Nhật</span>
                    <span className="text-red-400 font-semibold">Nghỉ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}