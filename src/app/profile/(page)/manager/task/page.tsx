"use client";

import TaskManager from "../../../tab/TaskManager";
import { useProfileData } from "@/src/hooks/profileHook";
import { redirect } from "next/navigation";

export default function TasksManagerPage() {
    const { permission } = useProfileData();

    if (permission === false) redirect("/profile/skills");
    if (!permission) return null; // loading

    return <TaskManager />;
}