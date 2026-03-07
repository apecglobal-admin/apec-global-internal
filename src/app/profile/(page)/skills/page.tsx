"use client";

import SkillsTab from "../../tab/skills";
import { useProfileData } from "@/src/hooks/profileHook";

export default function SkillsPage() {
    const { userKPI } = useProfileData();
    if (!userKPI) return null;
    return <SkillsTab userInfo={userKPI.kpis} />;
}