import { useSelector } from 'react-redux';

export const useAttendanceData = () => {
  const attendance = useSelector((state: any) => state.attendance);
  
  return {
    // Data 
    historyCheckin: attendance.historyCheckin.data.data,

    // Loading states



    // Error states


    // Status codes

  };
};