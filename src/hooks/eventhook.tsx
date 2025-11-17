import { useSelector } from 'react-redux';

export const useEventData = () => {
  const event = useSelector((state: any) => state.event);

  return {
    // Data 
    typeEvent: event.typeEvent.data,
    listEvent: event.listEvent.data,
    listTimeLine: event.listTimeLine.data,
    stateEvent: event.stateEvent.data
    // Loading states


    // Error states


    // Status codes

  };
};