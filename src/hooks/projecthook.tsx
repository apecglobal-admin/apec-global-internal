import { useSelector } from 'react-redux';

export const useProjectData = () => {
  const project = useSelector((state: any) => state.project);

  return {
    // Data 
    listProject: project.listProject.data,
    statProject: project.statProject.data,
    // Loading states


    // Error states


    // Status codes

  };
};