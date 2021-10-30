import React, { useState } from 'react';
import { cronofyActions } from '../../actions';
import './CreateEventPage.css';

const { createEvent, createNotificationsChannel } = cronofyActions;

const CreateEventPage = (event) => {
  const [ atendee, setAtendee ] = useState({ email: "stefanofrontani13@gmail.com" });
  const [ transitionsOffsets, setTransitionsOffsets ] = useState([]);

  const urlSearchParams = new URLSearchParams(window.location.search);
  const stringifiedSlot = urlSearchParams.get('slot');
  const slot = JSON.parse(stringifiedSlot);
  const organizerId = urlSearchParams.get('organizerId');

  const handleCreateEvent = () => {
    if (atendee) {
      const { email } = atendee;
      const attendees = {
        invite: [
          {
            email: email,
            display_name: `Invitee ${email}`
          }
        ]
      }
      slot.attendees = attendees;
    }
    // if (Object.keys(transitionsOffsets).length) {
    //   slot.subscriptions = [
    //     {
    //       type: "webhook",
    //       uri: "http://b628-152-168-95-55.ngrok.io/cronofy/events/triggers",
    //       transitions: formatTransitions(transitionsOffsets)
    //     }
    //   ];
    // }
    createEvent(slot);
  }

  const handleCreateNotificationsChannel = () => {
    createNotificationsChannel(organizerId);
  }

  const handleOnChange = ({ target }) => {
    const { name, value } = target;
    setAtendee({ [name]: value })
  }

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

  const startDate = new Date(slot.start);
  const endDate = new Date(slot.end);
  const formattedStartDate = startDate && startDate.toLocaleString('es-AR', {});
  const formattedEndDate = endDate && endDate.toLocaleString('es-AR', {});

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
        <div className="form-row">
          <div className="field">
            <label>Before event start (minutes)</label>
            <input type="number" data-eventbeforeafter="before" data-eventstartend="start" onChange={handleTransitions}/>
          </div>
          <div className="field">
            <label>After event start (minutes)</label>
            <input type="number" data-eventbeforeafter="after" data-eventstartend="start" onChange={handleTransitions}/>
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label>Before event end (minutes)</label>
            <input type="number" data-eventbeforeafter="before" data-eventstartend="end" onChange={handleTransitions}/>
          </div>
          <div className="field">
            <label>After event end (minutes)</label>
            <input type="number" data-eventbeforeafter="after" data-eventstartend="end" onChange={handleTransitions}/>
          </div>
        </div>
      </form>
      <div className="confirmation">
        <button onClick={handleCreateEvent}>
          CONFIRM EVENT WITH ATENDEE
        </button>
      </div>
      <div className="notification-channel">
        <button onClick={handleCreateNotificationsChannel}>
          CREATE NOTIFICATION CHANNEL
        </button>
      </div>
    </div>
  )
}

export default CreateEventPage;