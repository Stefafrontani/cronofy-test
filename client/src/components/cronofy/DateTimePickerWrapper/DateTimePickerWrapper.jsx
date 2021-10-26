import React, { useState, useEffect } from 'react';
import * as CronofyElements from "cronofy-elements";

const DateTimePickerWrapper = ({ options }) => {
  const [element, setElement] = useState(null);
  
  useEffect(() => {
    if (!element) {
      setElement(
        CronofyElements.DateTimePicker(options)
      );
    }
  }, [])

  useEffect(() => {
    if (element) {
      element.update(options)
    }
  }, [options])

  return (
    <div id="cronofy-date-time-picker" />
  );
}

export default DateTimePickerWrapper;