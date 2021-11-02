import React, { useState, useEffect } from 'react';

const fields = [
  {
    label: 'Summary',
    name: 'summary',
    defaultValue: 'Default summary'
  },
  {
    label: 'Description',
    name: 'description',
    defaultValue: 'Default Description'
  }
]

const EventData = ({ handleCallback }) => {
  const [ data, setData ] = useState(
    fields.reduce((acc, curr) => {
      return { ...acc, [curr.name]: curr.defaultValue }
    }, {})
  );

  const handleData = ({ target }) => {
    const { name, value } = target;
    setData({ ...data, [name]: value })
  }

  const formatData= (data) => {
    let formattedTransitions = data;

    return formattedTransitions;
  }

  useEffect(() => {
    handleCallback(formatData(data))
  }, [data]);

  return (
    <form>
      {fields.map((field, index) => {
        return (
          <div key={index} className="form-row">
            <div className="field">
              <label>{field.label}</label>
              <input type="text" name={field.name} value={data[field.name]} onChange={handleData}/>
            </div>
          </div>
        )
      })}
    </form>
  )
}

export default EventData;