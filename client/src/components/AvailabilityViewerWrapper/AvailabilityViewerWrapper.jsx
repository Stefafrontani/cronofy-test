import React, { useState, useEffect } from 'react';
import * as CronofyElements from "cronofy-elements";

const AvailabilityViewerWrapper = ({ options }) => {
  const [AvailabilityWrapper, setAvailabilityWrapper] = useState(null);
  
  useEffect(() => {
    if (!AvailabilityWrapper) {
      setAvailabilityWrapper(
        CronofyElements.AvailabilityViewer(options)
      );
    }
  }, [])


  useEffect(() => {
    if (AvailabilityWrapper) {
      AvailabilityWrapper.update(options)
    }
  }, [options])

  return (
    <div id="cronofy-availability-viewer" />
  );
}

export default AvailabilityViewerWrapper;