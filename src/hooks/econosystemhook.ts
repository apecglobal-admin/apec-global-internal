import { useSelector } from 'react-redux';

export const useEconosystemData = () => {
  const econosystem = useSelector((state: any) => state.econosystem);
  
  return {
    // Data 
    listELearning: econosystem.listELearning.data,
    listTools: econosystem.listTools.data,
    listCreative: econosystem.listCreative.data,
    listNews: econosystem.listNews.data,

    // Loading states



    // Error states


    // Status codes

  };
};