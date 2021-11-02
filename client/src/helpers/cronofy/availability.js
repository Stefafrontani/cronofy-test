const queryPeriod1 = {
  start: "2021-11-02T20:00:00Z",
  end: "2021-11-02T23:00:00Z"
}
const queryPeriod2 = {
  start: "2021-12-16T12:00:00Z",
  end: "2021-12-16T17:30:00Z"
}

const query = (subs) => {
  const { must: mustUsers, optional: optionalUsers } = subs;
  let participants = [];

  if (mustUsers.length > 0) {
    participants = [ 
      ...participants,
      {
        required: 'all',
        members: [ ...mustUsers.map(sub => ({ sub })) ]
      }
    ]
  }
  if (optionalUsers.length > 0) {
    participants = [ 
      ...participants,
      {
        required: 1,
        members: [ ...optionalUsers.map(sub => ({ sub })) ]
      }
    ]
  }

  return ({
    participants,
    required_duration: {
      minutes: 60
    },
    query_periods: [
      queryPeriod1,
      queryPeriod2
    ]
  })
};

const confirmedSlotCallback = (res, organizerId) => {
  // Check if this is a `slot_selected` notification.
  // If not, we'll return and do nothing.
  if (res.notification.type !== "slot_selected") return;
  
  // Convert the slot info into a URL-safe string.
  const slot = JSON.stringify(res.notification.slot);

  // Load the last page of our app, with the `slot` in the query string.
  window.location.href = `/createEvent?organizerId=${organizerId}&slot=${slot}`;
};

export const availability = {
  query,
  confirmedSlotCallback
};