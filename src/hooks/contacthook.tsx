import { useSelector } from 'react-redux';

export const useContactData = () => {
  const contact = useSelector((state: any) => state.contact);
  
  return {
    // Data 
    listContact: contact.listContact.data,
    // Loading states



    // Error states


    // Status codes

  };
};