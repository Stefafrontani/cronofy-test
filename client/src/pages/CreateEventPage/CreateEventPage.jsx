import React, { useState } from 'react';
import { cronofyActions } from '../../actions';
import './CreateEventPage.css';

const { createEvent, createSmartInvitee } = cronofyActions;

const REACT_APP_CRONOFY_SECRET = process.env.REACT_APP_CRONOFY_SECRET
const REACT_APP_CRONOFY_CLIENT_ID = process.env.REACT_APP_CRONOFY_CLIENT_ID
const REACT_APP_CRONOFY_AUTH_BASE_URL = process.env.REACT_APP_CRONOFY_AUTH_BASE_URL  
const REACT_APP_CRONOFY_REDIRECT_URI = process.env.REACT_APP_CRONOFY_REDIRECT_URI

const CreateEventPage = (event) => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const stringifiedSlot = urlSearchParams.get('slot');
  const [ atendee, setAtendee ] = useState({ email: "stefanofrontani13@gmail.com" });
  const slot = JSON.parse(stringifiedSlot);

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
    createEvent(slot);
  }

  const handleOnChange = ({ target }) => {
    const { name, value } = target;
    setAtendee({ [name]: value })
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
        <label>Email</label>
        <input value={atendee.email} name="email" onChange={handleOnChange}/>
      </form>
      <div className="confirmation">
        <button onClick={handleCreateEvent}>
          CONFIRM EVENT WITH ATENDEE
        </button>
      </div>
    </div>
  )
}

export default CreateEventPage;