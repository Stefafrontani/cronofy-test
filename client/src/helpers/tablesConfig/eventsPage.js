const eventsPageAppTableHeaders = [ "url", "description", "cronofy-client-options", "cronofy-client-method", "cronofy-client-method-options", "query", "body", "call"];
const eventsPageAppTableRows = [
  [
    "GET: /users/:userId/events",
    ["App endpoint", "Request to get events", "Done after select user"],
    "----",
    "----",
    "----",
    "userId",
    "----",
    {
      html: "GET EVENTS",
      component: 'button',
      props: {}
    }
  ]
]

const eventsPageAppTableConfig = { headers: eventsPageAppTableHeaders, rows: eventsPageAppTableRows }
const eventsPageCronofyTableConfig = { headers: [], rows: [] }

export const eventsPageTablesConfig = {
  app: eventsPageAppTableConfig,
  cronofy: eventsPageCronofyTableConfig
}