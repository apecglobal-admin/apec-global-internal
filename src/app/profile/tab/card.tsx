import { useState } from 'react';
import { ChevronLeft, ChevronRight, CreditCard, Star, Zap } from 'lucide-react';

function CardTab({ userInfo }: any) {
    const [activeIndex, setActiveIndex] = useState(0);

    const cards = [
        {
            id: 0,
            name: 'Standard Card',
            type: 'Visa',
            image: 'https://res.cloudinary.com/doalcoyik/image/upload/v1748918349/Asset_25_288x_ychgve.png',
            gradient: 'from-blue-600 via-blue-500 to-purple-600',
            icon: CreditCard,
            info: [
                { label: 'Hạn mức tín dụng', value: '50.000.000 VNĐ' },
                { label: 'Số dư khả dụng', value: '45.000.000 VNĐ' },
                { label: 'Ngày thanh toán', value: '15 hàng tháng' },
                { label: 'Lãi suất', value: '1.5% / tháng' },
            ],
            terms: [
                'Miễn phí thường niên năm đầu tiên',
                'Hoàn tiền 0.5% cho mọi giao dịch',
                'Bảo hiểm du lịch miễn phí',
                'Hỗ trợ 24/7 qua hotline',
                'Tích điểm thưởng cho mỗi giao dịch'
            ]
        },
        {
            id: 1,
            name: 'Gold Card',
            type: 'Mastercard',
            image: 'https://res.cloudinary.com/doalcoyik/image/upload/v1748918372/Asset_24_288x_wwzzxf.png',
            gradient: 'from-amber-500 via-yellow-500 to-orange-500',
            icon: Star,
            info: [
                { label: 'Hạn mức tín dụng', value: '100.000.000 VNĐ' },
                { label: 'Số dư khả dụng', value: '92.000.000 VNĐ' },
                { label: 'Ngày thanh toán', value: '20 hàng tháng' },
                { label: 'Lãi suất', value: '1.2% / tháng' },
            ],
            terms: [
                'Miễn phí thường niên trọn đời',
                'Hoàn tiền 1.5% cho mọi giao dịch',
                'Bảo hiểm du lịch quốc tế cao cấp',
                'Truy cập phòng chờ sân bay VIP',
                'Tích điểm x2 cho danh mục đặc biệt',
            ]
        },
        {
            id: 2,
            name: 'Platinum Card',
            type: 'Visa Platinum',
            image: 'https://res.cloudinary.com/doalcoyik/image/upload/v1748918478/Asset_23_288x_oopetk.png',
            gradient: 'from-slate-700 via-slate-600 to-slate-800',
            icon: Zap,
            info: [
                { label: 'Hạn mức tín dụng', value: '200.000.000 VNĐ' },
                { label: 'Số dư khả dụng', value: '195.000.000 VNĐ' },
                { label: 'Ngày thanh toán', value: '25 hàng tháng' },
                { label: 'Lãi suất', value: '0.99% / tháng' },
            ],
            terms: [
                'Miễn phí thường niên trọn đời',
                'Hoàn tiền 3% cho mọi giao dịch',
                'Bảo hiểm toàn diện (y tế, du lịch, mua sắm)',
                'Truy cập không giới hạn phòng chờ sân bay toàn cầu',
                'Concierge service 24/7',
           
            ]
        }
    ];

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % cards.length);
    };

    const currentCard = cards[activeIndex];
    const Icon = currentCard.icon;

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
                                    src={currentCard.image}
                                    alt={currentCard.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Navigation Buttons */}
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
                        </div>

                        {/* Indicators */}
                        <div className="flex justify-center gap-2 mt-4">
                            {cards.map((card, index) => (
                                <button
                                    key={card.id}
                                    onClick={() => setActiveIndex(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        index === activeIndex 
                                            ? 'w-8 bg-blue-500' 
                                            : 'w-2 bg-slate-600 hover:bg-slate-500'
                                    }`}
                                    aria-label={`Chuyển đến ${card.name}`}
                                />
                            ))}
                        </div>
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
                                {currentCard.info.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0"
                                    >
                                        <span className="text-sm text-slate-400">
                                            {item.label}
                                        </span>
                                        <span className="text-sm font-semibold text-white">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                <Star size={20} className="text-yellow-400" />
                                Điều khoản & Ưu đãi
                            </h3>
                            <ul className="space-y-2">
                                {currentCard.terms.map((term, index) => (
                                    <li
                                        key={index}
                                        className="text-sm text-slate-300 flex items-start gap-2"
                                    >
                                        <span className="text-green-400 mt-0.5">✓</span>
                                        <span>{term}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CardTab;