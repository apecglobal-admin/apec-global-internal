import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CreditCard, Star, Calendar, TrendingUp, DollarSign } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { listCard } from "@/src/services/api";

function CardTab({ userInfo }: any) {
  const dispatch = useDispatch();
  const { cards } = useSelector((state: any) => state.user);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      dispatch(listCard(token as any) as any);
    }
  }, [dispatch]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Đang tải thông tin thẻ...</p>
      </div>
    );
  }

  const currentCard = cards[activeIndex];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="">
      <div className="w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card Carousel Section */}
          <div className="relative">
            {/* Credit Card Display */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 shadow-inner p-4">
              <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={currentCard.src}
                  alt={currentCard.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Navigation Buttons */}
              {cards.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80 rounded-full p-2 transition-colors border border-slate-600"
                    aria-label="Thẻ trước"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>

                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80 rounded-full p-2 transition-colors border border-slate-600"
                    aria-label="Thẻ sau"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Indicators */}
            {cards.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {cards.map((card: any, index: number) => (
                  <button
                    key={card.id}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-8 bg-blue-500"
                        : "w-2 bg-slate-600 hover:bg-slate-500"
                    }`}
                    aria-label={`Chuyển đến ${card.name}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="space-y-4">
            {/* Card Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-400" />
                Thông tin thẻ
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-sm text-slate-400">Tên thẻ</span>
                  <span className="text-sm font-semibold text-white">
                    {currentCard.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-sm text-slate-400 flex items-center gap-1">
                    <DollarSign size={14} />
                    Hạn mức tối đa
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {formatCurrency(currentCard.max_credit)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-sm text-slate-400 flex items-center gap-1">
                    <TrendingUp size={14} />
                    Lãi suất
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {currentCard.interest_rate}%/tháng
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-sm text-slate-400 flex items-center gap-1">
                    <Calendar size={14} />
                    Ngày thanh toán
                  </span>
                  <span className="text-sm font-semibold text-white">
                    Ngày {currentCard.pay_date} hàng tháng
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-sm text-slate-400">Loại thẻ</span>
                  <span className="text-sm font-semibold text-white uppercase">
                    {currentCard.type}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-400">Trạng thái</span>
                  <span className={`text-sm font-semibold ${currentCard.isActive ? 'text-green-400' : 'text-orange-400'}`}>
                    {currentCard.isActive ? 'Đang hoạt động' : 'Chưa kích hoạt'}
                  </span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Star size={20} className="text-yellow-400" />
                Quyền lợi & Ưu đãi
              </h3>
              <ul className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {currentCard.benefits && currentCard.benefits.map((benefit: any) => (
                  <li
                    key={benefit.id}
                    className="text-sm text-slate-300 flex items-start gap-2"
                  >
                    <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                    <span dangerouslySetInnerHTML={{ __html: benefit.features }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.7);
        }
      `}</style>
    </div>
  );
}

export default CardTab;