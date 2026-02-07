import { useSelector } from 'react-redux';

export const useDashboardData = () => {
  const dashboard = useSelector((state: any) => state.dashboard);
  
  return {
    // Data 
    listStatistic: dashboard.listStatistic.data,
    listHumanResource: dashboard.listHumanResource.data,
    listMaintain: dashboard.listMaintain.data,
    listAchievement: dashboard.listAchievement.data,
    listGrowth: dashboard.listGrowth.data,
    listTopProduct: dashboard.listTopProduct.data,
    listDashboardTasks: dashboard.listDashboardTasks.data.data,
    listDashboardManagerTasks: dashboard.listDashboardManagerTasks.data.data

    // Loading states



    // Error states


    // Status codes

  };
};