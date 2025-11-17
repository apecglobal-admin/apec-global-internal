import { useSelector } from 'react-redux';

export const useAnnouncementData = () => {
  const announcement = useSelector((state: any) => state.announcement);

  return {
    // Data 
    typeAnnouncements: announcement.typeAnnouncements.data,
    listAnnouncement: announcement.listAnnouncement.data

    // Loading states


    // Error states


    // Status codes

  };
};