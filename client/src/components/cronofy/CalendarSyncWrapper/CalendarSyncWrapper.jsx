import React, { useState, useEffect } from 'react';
import * as CronofyElements from "cronofy-elements";

const CalendarSyncWrapper = ({ options }) => {
  const [element, setElement] = useState(null);
  
  useEffect(() => {
    if (!element) {
      setElement(
        CronofyElements.CalendarSync(options)
      );
    }
  }, [])

  useEffect(() => {
    if (element) {
      element.update(options)
    }
  }, [options])

  return (
    <div id="cronofy-calendar-sync" />
  );
}

export default CalendarSyncWrapper;