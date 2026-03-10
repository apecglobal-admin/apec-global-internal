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

    const handleClick = async () => {
        if (isLoading) return;

        setIsLoading(true);
        const token = localStorage.getItem("userToken");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const res = await dispatch(checkin({
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                        token,
                    }) as any);

                    if(res.payload.data.success){
                        toast.success(res.payload.data.message)
                    }else{
                        toast.error(res.payload.data.message)

                    }
                } finally {
                    setIsLoading(false);
                }
            },
            (error) => {
                console.error("Không thể lấy vị trí:", error.message);
                setIsLoading(false);
            },
            { timeout: 5000 }
        );
    };

    return (
        <motion.button
            className={cn(
                "fixed bottom-20 md:bottom-8 left-5 z-50 flex items-center justify-center w-10 h-10 rounded-full shadow-2xl transition-colors duration-300 cursor-pointer",
                isLoading
                    ? "bg-gradient-to-r from-blue-400 to-cyan-400 shadow-blue-300/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-blue-500/50 hover:shadow-blue-400/50"
            )}
            whileHover={!isLoading ? { scale: 1.1 } : {}}
            whileTap={!isLoading ? { scale: 0.9 } : {}}
            onClick={handleClick}
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
    );
}