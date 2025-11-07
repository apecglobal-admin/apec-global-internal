import { listLink } from "@/src/services/api";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function LinkTab({ userInfo }: any) {
  const dispatch = useDispatch();
  const { links } = useSelector((state: any) => state.user);

  useEffect(() => {
    dispatch(listLink() as any);
  }, [dispatch]);

  // Sử dụng dữ liệu từ API
  const socialLinks = links || [];

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="w-full">
        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialLinks.map((linkItem: any) => {
            return (
              <button
                key={linkItem.id}
                onClick={() => handleLinkClick(linkItem.link)}
                className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 backdrop-blur p-5 hover:border-blue-500 hover:bg-slate-900/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group w-full text-left"
              >
                {linkItem.src && (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full overflow-hidden flex-shrink-0 border-2 border-slate-700 group-hover:border-blue-500 transition-colors">
                    <img
                      src={linkItem.src}
                      alt={linkItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="text-lg font-semibold text-white leading-tight mb-1 group-hover:text-blue-400 transition-colors">
                    {linkItem.name}
                  </div>
                  {linkItem.description && (
                    <div className="text-sm text-slate-400 truncate">
                      {linkItem.description}
                    </div>
                  )}
                </div>

                <div className="text-slate-600 group-hover:text-blue-500 transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
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