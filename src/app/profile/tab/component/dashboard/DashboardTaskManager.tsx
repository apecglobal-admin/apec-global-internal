import { getDashboardManagerTasks } from '@/src/features/dashboard/api/api';
import { useDashboardData } from '@/src/hooks/dashboardhook';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, ClipboardList, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

function DashboardTaskManager() {
    const dispatch = useDispatch();
    const {listDashboardManagerTasks } = useDashboardData();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if(!listDashboardManagerTasks){
            dispatch(getDashboardManagerTasks({token }) as any)
        }
    }, []);

    const colorMap: any = {
        "2": { bg: "bg-blue-500", text: "text-blue-400" },
        "3": { bg: "bg-orange-500", text: "text-orange-400" },
        "4": { bg: "bg-green-500", text: "text-green-400" },
        "5": { bg: "bg-red-500", text: "text-red-400" },
      };

    return(
        <div>
          {listDashboardManagerTasks && (
            <div className="space-y-2 mb-4">
              <button
                onClick={() => setIsVisible(!isVisible)}
                className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 rounded-lg px-4 py-2 transition-all duration-200"
              >
                <span className="text-white font-semibold text-sm">Dashboard Tổng Quan</span>
                {isVisible ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>
  
              {isVisible && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-1.5 bg-white/20 rounded-md">
                          <ClipboardList className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-blue-100 text-xs font-medium">
                          {listDashboardManagerTasks.total_task_assignments?.label}
                        </p>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-bold text-white">
                            {listDashboardManagerTasks.total_task_assignments?.value || 0}
                          </p>
                          <p className="text-blue-200 text-xs">nhiệm vụ</p>
                        </div>
                      </div>
                    </div>
  
                    <div className="relative overflow-hidden bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-1.5 bg-white/20 rounded-md animate-pulse">
                          <AlertCircle className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-red-100 text-xs font-medium">
                          {listDashboardManagerTasks.overdue_tasks?.label}
                        </p>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-bold text-white">
                            {listDashboardManagerTasks.overdue_tasks?.value || 0}
                          </p>
                          <p className="text-red-200 text-xs">cần xử lý</p>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-3 shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-purple-600/20 rounded">
                            <CheckCircle2 className="h-4 w-4 text-purple-400" />
                          </div>
                          <h3 className="text-xs font-bold text-white">
                            {listDashboardManagerTasks.tasks_by_status?.label}
                          </h3>
                        </div>
                        <div className="px-2 py-0.5 bg-purple-600/20 rounded-full">
                          <span className="text-purple-300 text-xs font-semibold">
                            {listDashboardManagerTasks.tasks_by_status?.items?.reduce((sum: any, item: any) => sum + item.total, 0) || 0}
                          </span>
                        </div>
                      </div>
  
                      <div className="space-y-2">
                        {listDashboardManagerTasks.tasks_by_status?.items && 
                        listDashboardManagerTasks.tasks_by_status.items.length > 0 ? (
                          listDashboardManagerTasks.tasks_by_status.items.map((item: any, index: any) => {
                            const colors = colorMap[item.task_status] || { bg: "bg-slate-500", text: "text-slate-400" };
                            return (
                              <div key={index}>
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs font-medium ${colors.text}`}>{item.label}</span>
                                  <span className={`text-sm font-bold px-2 py-0.5 ${colors.text} rounded`}>
                                    {item.total}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-4">
                            <CheckCircle2 className="h-6 w-6 text-slate-500 mx-auto mb-1" />
                            <p className="text-xs text-slate-400">Chưa có dữ liệu</p>
                          </div>
                        )}
                      </div>
                    </div>
  
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-3 shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-orange-600/20 rounded">
                            <Star className="h-4 w-4 text-orange-400" />
                          </div>
                          <h3 className="text-xs font-bold text-white">
                            {listDashboardManagerTasks.tasks_by_priority?.label}
                          </h3>
                        </div>
                        <div className="px-2 py-0.5 bg-orange-600/20 rounded-full">
                          <span className="text-orange-300 text-xs font-semibold">
                            {listDashboardManagerTasks.tasks_by_priority?.items?.reduce((sum: any, item: any) => sum + item.total, 0) || 0}
                          </span>
                        </div>
                      </div>
  
                      <div className="space-y-2">
                        {listDashboardManagerTasks.tasks_by_priority?.items && 
                            listDashboardManagerTasks.tasks_by_priority.items.length > 0 ? (
                            listDashboardManagerTasks.tasks_by_priority.items.map((item: any, index: any) => {
                                const colors = colorMap[item.task_priority] || { bg: "bg-slate-500", text: "text-slate-400" };
    
                                return (
                                <div key={index}>
                                    <div className="flex items-center justify-between">
                                    <span className={`text-xs font-medium ${colors.text}`}>{item.label}</span>
                                    <span className={`text-sm font-bold px-2 py-0.5 ${colors.text} rounded`}>
                                        {item.total}
                                    </span>
                                    </div>
                                </div>
                                );
                            })
                        ) : (
                          <div className="text-center py-4">
                            <Star className="h-6 w-6 text-slate-500 mx-auto mb-1" />
                            <p className="text-xs text-slate-400">Chưa có dữ liệu</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )
}

export default DashboardTaskManager