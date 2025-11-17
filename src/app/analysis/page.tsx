"use client"

import React, { useState } from 'react';
import { TrendingUp, Award, Users, ShoppingBag, Target, ChevronRight, Star, ArrowUpRight, Globe, Briefcase, Menu, X } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '@/components/header';
import Footer from '@/components/footer';


type ColorKey = 'blue' | 'purple' | 'green' | 'orange';
export default function AnalysisPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dữ liệu thành tích
  const achievements = [
    { number: '2.5+', label: 'Tỷ VNĐ', subtitle: 'Doanh Thu Năm 2024', icon: <TrendingUp className="w-8 h-8" /> },
    { number: '15K+', label: 'Khách Hàng', subtitle: 'Tin Tưởng & Hài Lòng', icon: <Users className="w-8 h-8" /> },
    { number: '50K+', label: 'Sản Phẩm', subtitle: 'Đã Bán Ra Thị Trường', icon: <ShoppingBag className="w-8 h-8" /> },
    { number: '98%', label: 'Hài Lòng', subtitle: 'Đánh Giá 5 Sao', icon: <Star className="w-8 h-8" /> }
  ];

  // Dữ liệu tăng trưởng theo quý
  const growthData = [
    { quarter: 'Q1 2024', revenue: 520, growth: 15 },
    { quarter: 'Q2 2024', revenue: 680, growth: 22 },
    { quarter: 'Q3 2024', revenue: 750, growth: 28 },
    { quarter: 'Q4 2024', revenue: 850, growth: 35 }
  ];

  // Dữ liệu sản phẩm nổi bật
  const featuredProducts = [
    { name: 'Công Nghệ AI', sales: '8.5K', trend: '+45%', color: 'blue' },
    { name: 'Giải Pháp IoT', sales: '6.2K', trend: '+38%', color: 'purple' },
    { name: 'Cloud Services', sales: '5.8K', trend: '+32%', color: 'green' },
    { name: 'Smart Devices', sales: '4.3K', trend: '+28%', color: 'orange' }
  ];

  // Dữ liệu đối tác
  const partners = [
    'Microsoft', 'Google', 'Amazon', 'Samsung', 'Apple', 'Intel'
  ];

  const getColorClasses = (color: ColorKey) => {
    const colors = {
      blue: 'from-blue-600 to-blue-400',
      purple: 'from-purple-600 to-purple-400',
      green: 'from-green-600 to-green-400',
      orange: 'from-orange-600 to-orange-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      {/* Achievements Grid */}
      <section id="stats" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Thành Tích Nổi Bật 2025</h2>
            <p className="text-slate-600 text-lg">Con số ấn tượng minh chứng cho sự phát triển vượt bậc</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((item, index) => (
              <div 
                key={index} 
                className="relative bg-blue-gradiant-main  bg-box-shadow rounded-2xl p-8 hover:border-blue-500 hover:shadow-xl transition group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition"></div>
                <div className="relative">
                  <div className="text-blue-600 mb-4">
                    {item.icon}
                  </div>
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {item.number}
                  </div>
                  <div className="text-xl font-semibold mb-1 text-slate-900">{item.label}</div>
                  <div className="text-sm text-slate-600">{item.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Chart Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Tăng Trưởng Doanh Thu</h2>
            <p className="text-slate-600 text-lg">Biểu đồ doanh thu theo quý năm 2024 (Đơn vị: Triệu VNĐ)</p>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={growthData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="quarter" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="grid md:grid-cols-4 gap-4 mt-8">
              {growthData.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 text-center">
                  <div className="text-slate-600 text-sm mb-1">{item.quarter}</div>
                  <div className="text-2xl font-bold mb-1 text-slate-900">{item.revenue}M</div>
                  <div className="text-green-600 text-sm font-semibold flex items-center justify-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    +{item.growth}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Sản Phẩm Dẫn Đầu Thị Trường</h2>
            <p className="text-slate-600 text-lg">Những giải pháp công nghệ được yêu thích nhất</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div key={index} className="bg-white bg-box-shadow rounded-2xl p-6 hover:scale-105 hover:shadow-xl transition duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(product.color as ColorKey)} rounded-xl mb-4 flex items-center justify-center shadow-lg`}>
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{product.sales}</div>
                    <div className="text-sm text-slate-600">Đã bán</div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {product.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center ">
          <div className="bg-blue-gradiant-main rounded-3xl p-12 bg-box-shadow">
            <h2 className="text-4xl font-bold mb-4 text-blue-main">Sẵn Sàng Hợp Tác?</h2>
            <p className="text-xl mb-8 text-black opacity-90">
              Hãy để chúng tôi đồng hành cùng bạn trên con đường chuyển đổi số
            </p>
            <button className="px-8 py-4 bg-box-shadow bg-white text-blue-600 font-bold rounded-xl hover:bg-slate-100 hover:shadow-lg transition transform hover:scale-105">
              Liên Hệ Ngay
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}