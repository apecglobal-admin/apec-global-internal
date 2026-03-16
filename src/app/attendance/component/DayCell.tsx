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
  
  if (isEmpty) return <div className="w-full h-full" />;

  const isWeekend = isSunday || isSaturday;
  const dateColor = isWeekend ? "#ef4444" : "#111827";

  return (
    <div className="flex flex-col items-center justify-center gap-0.5 w-full h-full py-1">

      {/* Số ngày */}
      <span
        className="text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0"
        style={{
          color:      isToday ? "#fff" : dateColor,
          background: isToday ? "#2563eb" : "transparent",
        }}
      >
        {padZ(day)}
      </span>

      {/* Badge loại ngày */}
      {record ? (
        <button
          onClick={onClick}
          className="w-8 h-5 rounded flex items-center justify-center text-white font-bold flex-shrink-0"
          style={{
            background: TYPE_COLOR[record.type],
            fontSize: 10,
          }}
        >
          {TYPE_LABEL[record.type]}
        </button>
      ) : (
        <div className="w-8 h-5 rounded border border-dashed border-gray-200 flex-shrink-0" />
      )}
    </div>
  );
}