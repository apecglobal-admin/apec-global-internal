import { useSelector } from 'react-redux';

export const useProfileData = () => {
  const user = useSelector((state: any) => state.user);

  return {
    // Data 
    userInfo: user.userInfo.data,
    userKPI: user.userKpi.data,
    positions: user.positions.data,
    departments: user.departments.data,
    careers: user.careers.data,
    tasks: user.tasks.data,
    detailTask: user.detailTasks.data.task,
    typeTask: user.typeTask.data.data,
    personals: user.personals.data,
    typePersonal: user.typePersonal.data,
    achievements: user.achievements.data,
    projects: user.projects.data,
    cards: user.cards.data,
    links: user.links.data,
    listEmployeeDepartment: user.listEmployeeDepartment.data.data,
    totalKpiSkill: user.totalKpiSkill.data.data,
    listPersonalRequestAssign: user.listPersonalRequestAssign.data.data,
    detailPersonalRequestAssign: user.detailPersonalRequestAssign.data.data,
    listStatusPersonal: user.listStatusPersonal.data.data,
    listPersonalTarget: user.listPersonalTarget.data.data,
    detailPersonalTarget: user.detailPersonalTarget.data.data,
    permission: user.permission.data.data,
    
    // Loading states
    isLoadingUser: user.userInfo.loading,
    isLoadingPositions: user.positions.loading,
    isLoadingDepartments: user.departments.loading,
    isLoadingCareers: user.careers.loading,
    isLoadingTasks: user.tasks.loading,
    isLoadingTypeTask: user.typeTask.loading,
    isLoadingPersonals: user.personals.loading,
    isLoadingTypePersonal: user.typePersonal.loading,
    isLoadingAchievements: user.achievements.loading,
    isLoadingProjects: user.projects.loading,
    isLoadingCards: user.cards.loading,
    isLoadingLinks: user.links.loading,

    // Error states
    userError: user.userInfo.error,
    positionsError: user.positions.error,
    departmentsError: user.departments.error,
    careersError: user.careers.error,
    tasksError: user.tasks.error,
    typeTaskError: user.typeTask.error,
    personalsError: user.personals.error,
    typePersonalError: user.typePersonal.error,
    achievementsError: user.achievements.error,
    projectsError: user.projects.error,
    cardsError: user.cards.error,
    linksError: user.links.error,

    // Status codes
    userStatus: user.userInfo.status,
    positionsStatus: user.positions.status,
    departmentsStatus: user.departments.status,
    careersStatus: user.careers.status,
    tasksStatus: user.tasks.status,
    typeTaskStatus: user.typeTask.status,
    personalsStatus: user.personals.status,
    typePersonalStatus: user.typePersonal.status,
    achievementsStatus: user.achievements.status,
    projectsStatus: user.projects.status,
    cardsStatus: user.cards.status,
    linksStatus: user.links.status,
  };
};