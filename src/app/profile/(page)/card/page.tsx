"use client";

import CardTab from "../../tab/card";
import { useProfileData } from "@/src/hooks/profileHook";

export default function CardPage() {
    const { userInfo } = useProfileData();
    if (!userInfo) return null;
    return <CardTab userInfo={userInfo} />;
}