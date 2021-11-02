const createEventPageTableHeaders = [ "url", "description", "cronofy-client-options", "cronofy-client-method", "cronofy-client-method-options", "query", "body", "call"];
const createEventPageTableRows = [
  [
    "POST: /cronofy/events",
    [
      "Cronofy endpoint + App endpoints",
      "Creates an event in `events` table",
      "Creates data in `profiles_events` table -> 1row/calendarId. Used it from `events` table",
      "Creates an event on each organizer's calendar",
      "This event may have subscriptions to notify (before || after) when event (start || end)",
      "[Should create an invitation to atendee (candidates)]",
    ],
    [
      "Yet not created in cronofy"
    ],
    "Yet not created in cronofy",
    [
      "Yet not created in cronofy",
    ],
    "----",
    [
      'subscriptionCallbackUrl', 
      'summary',
      'description',
      'start',
      'end',
      'participants'
    ],
    {
      html: "CONFIRM EVENT WITH ATENDEE",
      component: 'button',
      props: {}
    }
  ]
]

const createEventPageCronofyTableConfig = { headers: createEventPageTableHeaders, rows: createEventPageTableRows }

export const createEventPageTablesConfig = {
  app: null,
  cronofy: createEventPageCronofyTableConfig
}
