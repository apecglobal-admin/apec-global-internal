import { padZ } from "@/src/utils/attendance";
import { TYPE_COLOR, TYPE_LABEL, type DayRecord } from "@/src/services/interface";

interface DayCellProps {
    day: number;
    record?: DayRecord;
    isToday: boolean;
    isSunday: boolean;
    isSaturday: boolean;
    isEmpty: boolean;
    onClick?: () => void;
}

export function DayCell({
    day,
    record,
    isToday,
    isSunday,
    isSaturday,
    isEmpty,
    onClick,
}: DayCellProps) {
    if (isEmpty) return <div />;

    const isWeekend = isSunday || isSaturday;
    const dateColor = isWeekend ? "#ef4444" : "#111827";

    return (
        <div className="flex flex-col items-center gap-0.5 relative">
            <span
                className="text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full"
                style={{
                    color: isToday ? "#fff" : dateColor,
                    background: isToday ? "#2563eb" : "transparent",
                }}
            >
                {padZ(day)}
            </span>

            {record ? (
                <button
                    onClick={onClick}
                    className="w-8 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: TYPE_COLOR[record.type] }}
                >
                    {TYPE_LABEL[record.type]}
                </button>
            ) : isWeekend ? (
                <div className="w-8 h-6" />
            ) : (
                <div className="w-8 h-6 rounded border border-dashed border-gray-200" />
            )}
        </div>
    );
}