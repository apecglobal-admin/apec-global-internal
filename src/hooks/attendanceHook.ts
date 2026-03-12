import { useSelector } from 'react-redux';

export const useAttendanceData = () => {
  const attendance = useSelector((state: any) => state.attendance);
  
  return {
    // Data 
    historyCheckin: attendance.historyCheckin.data.data,
    letters: attendance.letters.data.data,
    statusLetter: attendance.statusLetter.data.data,
    employeeLetter: attendance.employeeLetter?.data?.data?.data,
    totalEmployeeLetter: attendance.totalEmployeeLetter?.data?.data?.pagination?.total,

    // Loading states



    // Error states


    // Status codes

  };
};