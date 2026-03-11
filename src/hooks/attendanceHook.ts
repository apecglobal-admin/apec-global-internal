import { useSelector } from 'react-redux';

export const useAttendanceData = () => {
  const attendance = useSelector((state: any) => state.attendance);
  
  return {
    // Data 
    historyCheckin: attendance.historyCheckin.data.data,
    personalAttendance: attendance.personalAttendance.data.data,
    detailPersonalAttendance: attendance.detailPersonalAttendance.data.data,
    listAttendanceManagerAbsences:  attendance.listAttendanceManagerAbsences.data.data,
    detailListAttendanceManagerAbsences:  attendance.detailListAttendanceManagerAbsences.data.data,
    listTypeAttendanceAbsences: attendance.listTypeAttendanceAbsences.data.data,
    listStatusAttendanceAbsences: attendance.listStatusAttendanceAbsences.data.data,
    
    // Loading states
    loadingPersonalAttendance: attendance.personalAttendance.loading,
    loadingDetailPersonalAttendance: attendance.detailPersonalAttendance.loading,
    loadingListAttendanceManagerAbsences:  attendance.listAttendanceManagerAbsences.loading,
    loadingDetailListAttendanceManagerAbsences:  attendance.detailListAttendanceManagerAbsences.loading,

    // Error states


    // Status codes

  };
};