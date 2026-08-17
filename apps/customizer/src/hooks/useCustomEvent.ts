/* eslint-disable no-unused-vars */
import { useEffect } from 'react';

// Add your event names here
type YayMailCustomEventType = 'onYayMailImageBoxColumnSelected' | 'onYayMailBeforeSaveTemplate';
type ListenerType = (e: CustomEvent) => void;

const subscribe = (eventName: YayMailCustomEventType, listener: any) => {
  document.addEventListener(eventName, listener);
};

const unsubscribe = (eventName: YayMailCustomEventType, listener: any) => {
  document.removeEventListener(eventName, listener);
};

const publishCustomEvent = (eventName: YayMailCustomEventType, data: CustomEvent['detail']) => {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
};

const useCustomEventEffect = (eventName: YayMailCustomEventType, listener: ListenerType) => {
  useEffect(() => {
    subscribe(eventName, listener);

    return () => {
      unsubscribe(eventName, listener);
    };
  }, [eventName, listener]);
};

export { publishCustomEvent, useCustomEventEffect };
