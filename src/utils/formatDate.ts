export function formatDate(isoString: string) {
  return new Date(isoString).toISOString().split('T')[0];
}

export function formatMonthYearVN(date: Date): string {
  const formatter = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh", // GMT+7
    month: "2-digit",
    year: "numeric",
  });
  const parts = formatter.formatToParts(date);
  const month = parts.find(p => p.type === "month")?.value;
  const year = parts.find(p => p.type === "year")?.value;
  return `${month}/${year}`;
}