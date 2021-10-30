const endpointsPageAppTableHeaders = [ "url", "description", "cronofy-client-options", "cronofy-client-method", "cronofy-client-method-options", "query", "body", "call"];
const endpointsPageAppTableRows = [
  [
    "GET: /users",
    ["App endpoint", "Request to get users", "Done on mount"],
    "----",
    "----",
    "----",
    "userId",
    "----",
    {
      html: "GET USERS",
      component: 'button',
      props: {}
    }
  ]
]

const endpointsPageCronofyTableHeaders = [ "url", "description", "cronofy-client-options", "cronofy-client-method", "cronofy-client-method-options", "query", "body", "call"];
const endpointsPageCronofyTableRows = [
  [
    "GET: /users/3/info",
    ["Cronofy endpoint:", "Request to return user info"],
    "----",
    "----",
    "----",
    "userId",
    "----",
    {
      html: "GET USER INFO",
      component: 'button',
      props: {}
    }
  ],
  [
    "GET: /oauth/token/refresh",
    ["Cronofy endpoint", "request to refresh access token"],
    "----",
    "----",
    "----",
    "----",
    "userId",
    {
      html: "REFRESH TOKEN",
      component: 'button',
      props: {}
    }
  ]
]

const endpointsPageAppTableConfig = { headers: endpointsPageAppTableHeaders, rows: endpointsPageAppTableRows }
const endpointsPageCronofyTableConfig = { headers: endpointsPageCronofyTableHeaders, rows: endpointsPageCronofyTableRows }

export const endpointsPageTablesConfig = {
  app: endpointsPageAppTableConfig,
  cronofy: endpointsPageCronofyTableConfig
}