import { NextResponse } from "next/server"
import { query } from "@/lib/db"

type AnnouncementCategory = "general" | "urgent" | "personal"

type AnnouncementRow = {
  id: number
  title: string | null
  summary: string | null
  date: Date | string | null
  category: string | null
  department: string | null
  read: boolean | null
}

type AnnouncementResponseItem = {
  id: number
  title: string
  summary: string
  date: string
  category: AnnouncementCategory
  department: string
  read: boolean
}

export async function GET() {
  try {
    const rows = await query<AnnouncementRow>(
      "SELECT id, title, summary, date, category, department, read FROM announcements ORDER BY date DESC"
    )

    const data: AnnouncementResponseItem[] = rows.map((row) => {
      const dateValue = row.date instanceof Date ? row.date.toISOString().slice(0, 10) : row.date ?? ""
      const categoryValue = (row.category ?? "general") as AnnouncementCategory

      return {
        id: Number(row.id),
        title: row.title ?? "",
        summary: row.summary ?? "",
        date: dateValue,
        category: categoryValue,
        department: row.department ?? "",
        read: Boolean(row.read),
      }
    })

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load announcements" }, { status: 500 })
  }
}
