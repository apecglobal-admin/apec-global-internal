interface StatCardProps {
    value: number;
    label: string;
    color: string;
  }
  
export function StatCard({ value, label, color }: StatCardProps) {
    return (
        <div className="flex flex-col items-center flex-1 px-1">
        <span className="text-xl font-bold" style={{ color }}>
            {value}
        </span>
        <span
            className="text-xs text-center mt-0.5 leading-tight whitespace-pre-line"
            style={{ color: "#6b7280" }}
        >
            {label}
        </span>
        </div>
    );
}