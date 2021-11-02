import React, { useState } from 'react';
import EventSubscriptions from '../../components/EventSubscriptions/EventSubscriptions' ;
import EventData from '../../components/EventData/EventData' ;
import { cronofyActions } from '../../actions';
import { tablesConfig } from '../../helpers';
import './CreateEventPage.css';

const { createEventPageTablesConfig } = tablesConfig;

const { createEvent, createNotificationsChannel } = cronofyActions;

const CreateEventPage = () => {
  const [ atendee, setAtendee ] = useState({ email: "stefanofrontani13@gmail.com" });
  const [ eventData, setEventData ] = useState([]);
  const [ eventSubscriptions, setEventSubscriptions ] = useState([]);
  
  const urlSearchParams = new URLSearchParams(window.location.search);
  const stringifiedSlot = urlSearchParams.get('slot');
  const slot = JSON.parse(stringifiedSlot);
  const organizerId = urlSearchParams.get('organizerId');

  const handleCreateEvent = () => {
    const { summary, description } = eventData;
    const { start, end, participants } = slot;
    if (atendee) {
      const { email } = atendee;
      const attendees = {
        invite: [
          { email, display_name: `Invitee ${email}` }
        ]
      }
      slot.attendees = attendees;
    }

    const newEvent = {
      // subscriptionCallbackUrl, -> BE
      summary,
      description,
      start,
      end,
      participants,
      // status -> BE
    }

    if (eventSubscriptions.length) {
      newEvent.subscriptions = eventSubscriptions;
    }

    console.log(newEvent);
    createEvent(newEvent);
  }

  const handleOnChange = ({ target }) => {
    const { name, value } = target;
    setAtendee({ [name]: value })
  }

  const handleEventDataCallback = (formattedEventData) => {
    setEventData(formattedEventData);
  }
  const handleEventSubscriptionsCallback = (formattedEventSubscriptions) => {
    setEventSubscriptions(formattedEventSubscriptions);
  }

  const startDate = new Date(slot.start);
  const endDate = new Date(slot.end);
  const formattedStartDate = startDate && startDate.toLocaleString('es-AR', {});
  const formattedEndDate = endDate && endDate.toLocaleString('es-AR', {});

  createEventPageTablesConfig.cronofy.rows[0][createEventPageTablesConfig.cronofy.rows[0].length - 1].props = { onClick: handleCreateEvent }
  createEventPageTablesConfig.cronofy.rows[0][createEventPageTablesConfig.cronofy.rows[0].length - 1].html = atendee && atendee.email ? 'CONFIRM EVENT WITH ATENDEE' : 'CONFIRM EVENT WITH NO ATENDEE'

  return (
    <div className="createEventPage">
      <div className="event">
        <p>ON: <span>{formattedStartDate}</span></p>
        <p>TO: <span>{formattedEndDate}</span></p>
      </div>
      <form style={{ marginBottom: "10px" }}>
        <div className="form-row">
          <div className="field">
            <label>Atendee Email</label>
            <input value={atendee.email} name="email" onChange={handleOnChange}/>
          </div>
        </div>
      </form>
      <EventData handleCallback={handleEventDataCallback}/>
      <EventSubscriptions handleCallback={handleEventSubscriptionsCallback}/>
      <div className="table">
        {window.createTable(createEventPageTablesConfig.cronofy)}
      </div>
    </div>
  )
}

export default CreateEventPage;