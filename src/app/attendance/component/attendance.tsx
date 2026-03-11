"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useDispatch } from "react-redux";
import { checkin } from "@/src/features/attendance/api";
import { toast } from "react-toastify";

export default function CheckInButton() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ message: string; distance: number; now: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getLocation = () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        }
      );
    });
  };

  const getLocationWithRetry = async (retry = 1) => {
    try {
      return await getLocation();
    } catch (error: any) {
      if (retry > 0 && error.code === 3) {
        return await getLocationWithRetry(retry - 1);
      }
      throw error;
    }
  };

  const handleCheckin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const token = localStorage.getItem("userToken");

    if (!token) {
      setErrorMessage("Bạn chưa đăng nhập để thực hiện.");
      setIsLoading(false);
      return
    }

    try {
      const position = await getLocationWithRetry();

      const res = await dispatch(
        checkin({
          lat: position.coords.latitude,
          long: position.coords.longitude,
          token,
        }) as any
      );

      if (res.payload.data.success) {
        const { message, data } = res.payload.data;
        setSuccessData({ message, distance: Math.round(data.distance), now: data.now });
      } else {
        setErrorMessage(res.payload.data.message);
      }
    } catch (error: any) {

      if (error.code === 1) {
        setErrorMessage("Bạn đã từ chối quyền truy cập vị trí 📍");
      } else if (error.code === 2) {
        setErrorMessage("Không thể xác định vị trí. Hãy bật GPS.");
      } else if (error.code === 3) {
        setErrorMessage("Lấy vị trí quá lâu. Vui lòng thử lại.");
      } else {
        setErrorMessage("Không thể lấy vị trí.");
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        className={cn(
          "fixed bottom-20 md:bottom-8 left-5 z-50 flex items-center justify-center w-10 h-10 rounded-full shadow-2xl transition-colors duration-300 cursor-pointer",
          isLoading
            ? "bg-gradient-to-r from-blue-400 to-cyan-400 shadow-blue-300/50 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-blue-500/50 hover:shadow-blue-400/50"
        )}
        whileHover={!isLoading ? { scale: 1.1 } : {}}
        whileTap={!isLoading ? { scale: 0.9 } : {}}
        onClick={handleCheckin}
        title="Chấm công"
      >
        {isLoading
          ? <Loader2 className="text-white w-5 h-5 animate-spin" />
          : <MapPin className="text-white w-5 h-5" />
        }

        {isLoading && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-40 animate-ping" />
        )}
      </motion.button>
      {successData && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSuccessData(null)}
        >
          <motion.div
            className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl overflow-hidden"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onClick={e => e.stopPropagation()}
          >
            {/* glow bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-500/10 pointer-events-none" />

            {/* icon */}
            <div className="flex justify-center mb-4">
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/40"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
              >
                <MapPin className="text-white w-7 h-7" />
              </motion.div>
            </div>

            {/* message */}
            <motion.p
              className="text-center text-white font-bold text-lg mb-5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {successData.message}
            </motion.p>

            {/* info cards */}
            <motion.div
              className="grid grid-cols-2 gap-3 mb-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* time */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500 mb-1 font-medium">Thời gian</p>
                <p className="text-white font-bold text-sm">
                  {successData.now.split(' ')[1]}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {successData.now.split(' ')[0].split('-').reverse().join('/')}
                </p>
              </div>

              {/* distance */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500 mb-1 font-medium">Khoảng cách</p>
                <p className="text-white font-bold text-sm">
                  {successData.distance} <span className="text-slate-400 font-normal text-xs">m</span>
                </p>
                <p className={`text-xs mt-0.5 font-medium ${successData.distance <= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {successData.distance <= 100 ? 'Trong phạm vi' : 'Ngoài phạm vi'}
                </p>
              </div>
            </motion.div>

            {/* close btn */}
            <motion.button
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSuccessData(null)}
            >
              Đóng
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setErrorMessage(null)}
        >
          <motion.div
            className="relative bg-slate-900 border border-red-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl overflow-hidden"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-rose-500/10 pointer-events-none" />

            <div className="flex justify-center mb-4">
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-rose-400 flex items-center justify-center shadow-lg shadow-red-500/40"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
              >
                <MapPin className="text-white w-7 h-7" />
              </motion.div>
            </div>

            <motion.p
              className="text-center text-white font-bold text-lg mb-5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {errorMessage}
            </motion.p>

            <motion.button
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setErrorMessage(null)}
            >
              Đóng
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </>


  );
}