"use client";

import AchievementsTab from "../../tab/achievement";
import { useProfileData } from "@/src/hooks/profileHook";

export default function AchievementsPage() {
    const { userInfo } = useProfileData();
    if (!userInfo) return null;
    return <AchievementsTab userInfo={userInfo} />;
}