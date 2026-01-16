import { useSelector } from 'react-redux';

export const useCautionData = () => {
  const caution = useSelector((state: any) => state.caution);
  
  return {
    // Data 
    caution: caution.caution.data.data,
    listCautionKPI: caution.listCautionKPI.data.data,
    listCaution: caution.listCaution.data.data,
    // Loading states



    // Error states


    // Status codes

  };
};