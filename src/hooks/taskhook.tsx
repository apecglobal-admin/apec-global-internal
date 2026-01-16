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
    // Loading states



    // Error states


    // Status codes

  };
};