import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useEventData = () => {
  const event = useSelector((state: any) => state.event);

  const isLoadingTypeEvent = event.typeEvent.loading;
  const isLoadingListEvent = event.listEvent.loading;
  const isLoadingListTimeLine = event.listTimeLine.loading;
  const isLoadingStateEvent = event.stateEvent.loading;

  return {
    // Data 
    typeEvent: event.typeEvent.data,
    listEvent: event.listEvent.data,
    listTimeLine: event.listTimeLine.data,
    stateEvent: event.stateEvent.data,
    // Loading states
    isLoadingTypeEvent,
    isLoadingListEvent,
    isLoadingListTimeLine,
    isLoadingStateEvent,


    // Error states


    // Status codes

  };
};