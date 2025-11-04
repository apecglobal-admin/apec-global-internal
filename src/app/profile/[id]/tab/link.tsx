import { Award, Facebook, Instagram, Youtube, Globe, Mail, Phone, MapPin } from "lucide-react";

function LinkTab({ userInfo }: any) {
  const socialLinks = [
    {
      title: "Tổng kho Ecoop",
      url: "https://ecoop.vn",
      icon: Award,
      color: "bg-yellow-500",
      image: "https://i.imgur.com/eGuttTg.png"
    },
    {
      title: "Facebook",
      url: "https://facebook.com",
      icon: Facebook,
      color: "bg-blue-600",
      description: "Theo dõi chúng tôi trên Facebook"
    },
    {
      title: "Instagram",
      url: "https://instagram.com",
      icon: Instagram,
      color: "bg-pink-500",
      description: "Xem hình ảnh sản phẩm mới nhất"
    },
    {
      title: "YouTube",
      url: "https://youtube.com",
      icon: Youtube,
      color: "bg-red-600",
      description: "Subscribe kênh YouTube của chúng tôi"
    },
    {
      title: "Website",
      url: "https://example.com",
      icon: Globe,
      color: "bg-green-500",
      description: "Ghé thăm website chính thức"
    },
    {
      title: "Email",
      url: "mailto:contact@ecoop.vn",
      icon: Mail,
      color: "bg-purple-500",
      description: "contact@ecoop.vn"
    },
    {
      title: "Hotline",
      url: "tel:0123456789",
      icon: Phone,
      color: "bg-orange-500",
      description: "0123 456 789"
    },
    {
      title: "Địa chỉ",
      url: "https://maps.google.com",
      icon: MapPin,
      color: "bg-teal-500",
      description: "123 Đường ABC, Quận 1, TP.HCM"
    }
  ];

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="w-full">

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <button
                key={index}
                onClick={() => handleLinkClick(link.url)}
                className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 backdrop-blur p-5 hover:border-blue-500 hover:bg-slate-900/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group w-full text-left"
              >
                {link.image ? (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full overflow-hidden flex-shrink-0 border-2 border-slate-700 group-hover:border-blue-500 transition-colors">
                    <img src={link.image} alt={link.title} className="w-full h-full object-cover"/>
                  </div>
                ) : (
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full ${link.color} flex-shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-semibold text-white leading-tight mb-1 group-hover:text-blue-400 transition-colors">
                    {link.title}
                  </div>
                  {link.description && (
                    <div className="text-sm text-slate-400 truncate">
                      {link.description}
                    </div>
                  )}
                </div>

                <div className="text-slate-600 group-hover:text-blue-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LinkTab;