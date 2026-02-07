import { useSelector } from 'react-redux';

export const useAnnouncementData = () => {
  const announcement = useSelector((state: any) => state.announcement);
  
  return {
    // Data 
    typeAnnouncements: announcement.typeAnnouncements.data,
    listAnnouncement: announcement.listAnnouncement.data,
    slider: announcement.slider.data,
    detailAnnouncement: announcement.detailAnnouncement.data,

    // Loading states
    isLoadingListAnnoucement: announcement.listAnnouncement.loading,
    isLoadingtypeAnnouncement: announcement.typeAnnouncements.loading


    // Error states


    // Status codes

  };
};