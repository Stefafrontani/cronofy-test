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
  ],
  [
    "GET: /cronofy/users/:userId/notifications",
    [
      "Cronofy endpoint",
      "List the user notification channel",
    ],
    [
      "client_id",
      "client_secret",
      "data_center",
      "access_token"
    ],
    "listNotificationChannels",
    "----",
    "----",
    '----',
    {
      html: "LIST CHANNELS",
      component: 'button',
      props: {}
    }
  ],
  [
    "DELETE: /cronofy/users/:userId/notifications",
    [
      "Cronofy endpoint",
      "Close user notifications channel",
    ],
    [
      "client_id",
      "client_secret",
      "data_center",
      "access_token"
    ],
    "deleteNotificationChannel",
    [
      "channel_id"
    ],
    [
      "userId",
      "channelId",
    ],
    "----",
    {
      html: "CLOSE NOTIFICATIONS CHANNEL",
      component: 'button',
      props: {}
    }
  ],
  [
    "POST: /cronofy/events/notifications",
    [
      "Cronofy endpoint + App endpoints",
      "Creates a notification channel",
      "TODO: Determinate whether create multi channels for the event or what"
    ],
    [
      "client_id",
      "client_secret",
      "data_center",
      "access_token",
    ],
    "createNotificationChannel",
    [
      "callback_url",
    ],
    "----",
    [
      "userId"
    ],
    {
      html: "CREATE NOTIFICATION CHANNEL",
      component: 'button',
      props: {}
    }
  ],
]

const endpointsPageAppTableConfig = { headers: endpointsPageAppTableHeaders, rows: endpointsPageAppTableRows }
const endpointsPageCronofyTableConfig = { headers: endpointsPageCronofyTableHeaders, rows: endpointsPageCronofyTableRows }

export const endpointsPageTablesConfig = {
  app: endpointsPageAppTableConfig,
  cronofy: endpointsPageCronofyTableConfig
}