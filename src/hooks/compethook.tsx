import { useSelector } from 'react-redux';

export const useCompetData = () => {
  const compet = useSelector((state: any) => state.compet);

  return {
    // Data 
    listRankingCompet: compet.listRankingCompet.data,
    topRank: compet.topRank.data,
    // Loading states


    // Error states


    // Status codes

  };
};