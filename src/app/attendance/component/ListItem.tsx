import { getDowLabel, padZ } from "@/src/utils/attendance";
import { TYPE_COLOR, TYPE_LABEL, type DayRecord } from "@/src/services/interface"; 

interface ListItemProps {
  record: DayRecord;
  day: number;
  month: number;
  year: number;
  isToday?: boolean;
  onClick: () => void;
}

export function ListItem({ record, day, month, year, isToday, onClick }: ListItemProps) {
  const dowLabel = getDowLabel(year, month, day);
  const color    = TYPE_COLOR[record.type];
  const timeStr  = record.checkIn
    ? `${record.checkIn} - ${record.checkOut ?? ""}`
    : "";

  return (
    <button onClick={onClick} className="w-full text-left">
      {/* Date header */}
      <div className="px-4 py-2 bg-gray-50">
        <span className={`text-xs font-semibold ${isToday ? "text-green-500" : "text-gray-500"}`}>
          {dowLabel}, {padZ(day)}/{padZ(month)}
        </span>
      </div>

      {/* Row */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: color }}
          >
            {TYPE_LABEL[record.type]}
          </span>
          <span className="text-sm font-medium text-gray-800">
            {record.shiftName ?? "Ca làm việc"}
          </span>
        </div>
        <span className="text-sm text-gray-500 font-medium">{timeStr}</span>
      </div>
    </button>
  );
}