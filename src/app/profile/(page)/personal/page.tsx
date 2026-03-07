"use client";

import PersonalTab from "../../tab/personal";
import { useProfileData } from "@/src/hooks/profileHook";

export default function PersonalPage() {
    const { userInfo } = useProfileData();
    if (!userInfo) return null;
    return <PersonalTab userInfo={userInfo} />;
}