"use client";

import ProjectsTab from "../../tab/project";
import { useProfileData } from "@/src/hooks/profileHook";

export default function ProjectsPage() {
    const { userInfo } = useProfileData();
    if (!userInfo) return null;
    return <ProjectsTab userInfo={userInfo} />;
}