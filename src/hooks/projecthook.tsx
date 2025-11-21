import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';

export const useProjectData = () => {
  const project = useSelector((state: RootState) => state.project);

  return {
    // Data 
    listProject: project.listProject.data,
    statProject: project.statProject.data,
    statusProject: project.statusProject.data,
    // Loading states

    isLoadingListProject: project.listProject.loading,
    isLoadingStatProject: project.statProject.loading,
    isLoadingStatusProject: project.statusProject.loading,


    // Error states


    // Status codes

  };
};