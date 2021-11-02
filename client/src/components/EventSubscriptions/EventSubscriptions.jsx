import React, { useState, useEffect } from 'react';

const field1 = {
  label: 'Before event start (minutes)',
  eventbeforeafter: "before",
  eventstartend: "start",
  defaultValue: 10
};
const field2 = {
  label: 'After event start (minutes)',
  eventbeforeafter: "after",
  eventstartend: "start",
  defaultValue: 5
};
const field3 = {
  label: 'Before event end (minutes)',
  eventbeforeafter: "before",
  eventstartend: "end",
  defaultValue: 15
};
const field4 = {
  label: 'After event end (minutes)',
  eventbeforeafter: "after",
  eventstartend: "end",
  defaultValue: 5
};

const formRows = [
  [ field1, field2 ], [ field3, field4 ]
];

const fields = [ field1, field2, field3, field4 ]

const EventSubscriptions = ({ handleCallback }) => {
  const [ transitionsOffsets, setTransitionsOffsets ] = useState(
    fields.reduce((acc, curr) => {
      return { ...acc, [curr.eventbeforeafter]: { ...acc[curr.eventbeforeafter], [curr.eventstartend]: curr.defaultValue } }
    }, {})
  );

  const handleTransitions = ({ target }) => {
    const { name, value, dataset } = target;
    const { eventbeforeafter, eventstartend } = dataset;
    setTransitionsOffsets({ ...transitionsOffsets, [eventbeforeafter]: { ...transitionsOffsets[eventbeforeafter], [eventstartend]:  value } })
  }

  const formatTransitions= (transitions) => {
    let formattedTransitions = [];
    Object.entries(transitions).forEach(([key, startyend]) => {
      Object.keys(startyend).forEach((startoend) => {
        formattedTransitions.push({
            [key]: `event_${startoend}`,
            offset: { minutes: startyend[startoend] }
        });
      });
    });
    return formattedTransitions;
  }

  useEffect(() => {
    handleCallback(formatTransitions(transitionsOffsets))
  }, [transitionsOffsets]);

  return (
    <form>
        {formRows.map((row, index) => {
          return (
            <div key={index} className="form-row">
              {row.map((field, index) => {
                return (
                  <div key={index} className="field">
                    <label>{field.label}</label>
                    <input type="number" data-eventbeforeafter={field.eventbeforeafter} data-eventstartend={field.eventstartend} value={transitionsOffsets[field.eventbeforeafter][field.eventstartend]} onChange={handleTransitions}/>
                  </div>
                )
              })}
            </div>
          )
        })}
    </form>   
  )
}

export default EventSubscriptions;