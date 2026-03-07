"use client";

import LinkTab from "../../tab/link";
import { useProfileData } from "@/src/hooks/profileHook";

export default function LinkPage() {
    const { userInfo } = useProfileData();
    if (!userInfo) return null;
    return <LinkTab userInfo={userInfo} />;
}