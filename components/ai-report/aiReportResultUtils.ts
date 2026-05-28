export interface ReportResultWithReports<TReport> {
  reports: TReport[];
}

export const removeReportAtIndex = <
  TReport,
  TResult extends ReportResultWithReports<TReport>,
>(
  reportResult: TResult,
  reportIndex: number,
): TResult | null => {
  const nextReports = reportResult.reports.filter(
    (_, index) => index !== reportIndex,
  );

  if (nextReports.length === 0) {
    return null;
  }

  return {
    ...reportResult,
    reports: nextReports,
  };
};
