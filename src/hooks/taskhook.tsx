import { useSelector } from 'react-redux';

export const useTaskData = () => {
  const task = useSelector((state: any) => state.task);
  
  return {
    // Data 
    typeTask: task.typeTask.data.data,
    priorityTask: task.priorityTask.data.data,
    childKpi: task.childKpi.data.data,
    statusTask: task.statusTask.data.data,
    listProject: task.listProject.data.data,
    listEmployee: task.listEmployee.data.data,
    listDepartment: task.listDepartment.data.data,
    listPosition: task.listPosition.data.data,
    imageTask: task.imageTask.data.url,
    fileTask: task.fileTask.data.url,
    listSubTask: task.listSubTask.data.data, 
    listTaskAssign: task.listTaskAssign.data.data,
    listDetailTaskAssign: task.listDetailTaskAssign.data.data,
    detailTaskAssign: task.detailTaskAssign.data.data,
    supportTaskTypes: task.supportTaskTypes.data.data,
    supportTask: task.supportTask.data.data,
    detailSupportTask: task.detailSupportTask.data.data,
    supportTaskManager: task.supportTaskManager.data.data,
    detailSupportTaskManager: task.detailSupportTaskManager.data.data,
    supportTaskEmployee: task.supportTaskEmployee.data.data,
    detailSupportTaskEmployee: task.detailSupportTaskEmployee.data.data,
    supportTaskPending: task.supportTaskPending.data.data,
    detailSupportTaskPending: task.detailSupportTaskPending.data.data,
    supportTaskStatus: task.supportTaskStatus.data.data,
    listEmployeeSupport: task.listEmployeeSupport.data.data,
    

    // Loading states

    loadingListDetailTaskAssign: task.listDetailTaskAssign.loading,
    

    // Error states
    errorListDetailTaskAssign: task.listDetailTaskAssign.error

    // Status codes

  };
};