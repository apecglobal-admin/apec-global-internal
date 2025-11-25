"use client";

import { getDashboard } from "@/src/features/dashboard/api/api";
import { useDashboardData } from "@/src/hooks/dashboardhook";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


export default function StatisticsSection() {
    const dispatch = useDispatch();
    const { listStatistic, listHumanResource, listMaintain } = useDashboardData();

    useEffect(() => {
        const payloadStatistic = {
            key: "listStatistic",
            page: 1,
            group_id: "1,2,3,4",
        };

        const payloadHumanResource = {
            key: "listHumanResource",
            group_id: 5,
        };

        const payloadMaintain = {
            key: "listMaintain",
            page: 1,
            group_id: 6,
        };
        dispatch(getDashboard(payloadStatistic) as any);
        dispatch(getDashboard(payloadHumanResource) as any);
        dispatch(getDashboard(payloadMaintain) as any);
    }, []);


    return (
        <section
            style={{ boxShadow: "inset 0 0 10px rgba(64, 64, 64, 0.5)" }}
            className="rounded-2xl  bg-white p-6 sm:p-7 lg:p-8"
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="text-xs font-semibold uppercase  text-blue-950 sm:text-sm">
                        Thống kê & báo cáo
                    </div>
                    <h2 className="mt-2 text-2xl font-extrabold text-blue-main capitalize sm:text-3xl ">
                        Dashboard
                    </h2>
                    <p className="mt-2 text-sm text-black">
                        Dữ liệu đồng bộ từ ERP, CRM và ApecTech Dashboard giúp
                        theo dõi hiệu suất, tài chính, nhân sự và tiến độ công
                        nghệ.
                    </p>
                </div>
                {/* <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <button className="rounded-full border border-orange-500 bg-orange-400 px-4 py-2 text-xs font-semibold uppercase text-white transition hover:border-orange-700 hover:bg-orange-600">
            Xuất Excel
          </button>
          <button className="rounded-full border border-orange-500 bg-orange-400 px-4 py-2 text-xs font-semibold uppercase text-white transition hover:border-orange-700 hover:bg-orange-600">
            Xuất PDF
          </button>
        </div> */}
            </div>

            {/* Responsive Grid for listStatistic */}
            <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                {listStatistic?.map((metric: any, id: number) => (
                    <div
                        key={id}
                        className={`rounded-2xl bg-blue-gradiant-main p-5 sm:p-6 bg-box-shadow`}
                    >
                        <div className="text-xs uppercase  text-black font-semibold">
                            {metric.name}
                        </div>
                        <div className="mt-3 flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-blue-700">
                                {metric.dashboard_items.value}
                            </span>
                            <span
                                className={`text-xs font-semibold uppercase  ${
                                    metric.dashboard_items.change_type === "+"
                                        ? "text-emerald-700"
                                        : metric.dashboard_items.change_type ===
                                          "-"
                                        ? "text-red-500"
                                        : "text-slate-300"
                                }`}
                            >
                                {metric.dashboard_items.change_type}{" "}
                                {metric.dashboard_items.change_value}%
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-black">
                            {metric.dashboard_items.description}
                        </p>
                        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-emerald-400"
                                style={{
                                    width: metric.dashboard_items
                                        .progress_current,
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                <div className="rounded-2xl bg-[#d6e8ee] p-5 sm:p-6 bg-box-shadow bg-blue-gradiant-main">
                    {listHumanResource?.map((item: any) => (
                        <div key={item.id}>
                            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
                                <div className="text-xs uppercase  text-blue-700 font-extrabold">
                                    {item.name}
                                </div>
                                <span className="text-xs uppercase  text-blue-700 font-extrabold">
                                    Realtime
                                </span>
                            </div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                {item.dashboard_items.map((data: any) => (
                                    <div
                                        key={data.id}
                                        className="rounded-xl bg-white p-4 bg-box-shadow-inset"
                                    >
                                        <div className="text-xs uppercase  text-black font-bold">
                                            {data.title}
                                        </div>
                                        <div className="mt-2 text-xl font-semibold text-blue-800">
                                            {data.value}
                                        </div>
                                        <span
                                            className={`text-xs font-semibold uppercase  ${
                                                data.change_type === "+"
                                                    ? "text-emerald-700"
                                                    : data.change_type === "-"
                                                    ? "text-red-500"
                                                    : "text-slate-300"
                                            }`}
                                        >
                                            {data.change_type}{" "}
                                            {data.change_value}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-2xl bg-[#d6e8ee] p-5 sm:p-6 bg-box-shadow bg-blue-gradiant-main">
                    {listMaintain?.map((item: any) => (
                        <div key={item.id}>
                          <div className="text-xs uppercase  text-blue-800 font-extrabold ">
                              {item.name}
                          </div>
                          <div className="mt-4 space-y-3">
                              {item.dashboard_items.map((data: any) => {
                                const progress = data.progress_current*100/data.progress_total;
                                return(
                                  <div
                                      key={data.id}
                                      className="rounded-xl bg-white p-4 bg-box-shadow-inset"
                                  >
                                      <div className="flex items-center justify-between">
                                          <span className="text-xs uppercase  text-black font-bold">
                                              {data.title}
                                          </span>
                                          <span className="text-sm font-extrabold text-blue-800 ">
                                              {progress} {data.unit}
                                          </span>
                                      </div>
                                      <div className="mt-2 text-xs text-black">
                                          {data.description}
                                      </div>
                                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                          <div
                                              className="h-full rounded-full bg-blue-500"
                                              style={{ width: `${progress}%` }}
                                          ></div>
                                      </div>
                                  </div>

                                )
                              })}
                          </div>
                          
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}