const dateTimePickerPageTableHeaders = [ "url", "description", "cronofy-client-options", "cronofy-client-method", "cronofy-client-method-options", "query", "body", "call"];
const dateTimePickerPageTableRows = [
  [
    "GET: /cronofy/users/3/info",
    ["Cronofy endpoint", "Request to get element token for this DateTimePicker cronofy component"],
    [
      "client_id",
      "client_secret",
      "data_center"
    ],
    "cronofyClient.requestElementToken",
    [
      "version: '1'",
      "permissions: permissions",
      "subs: subs",
      "origin: process.env.COLONY_ORIGIN (http://localhost:3000)"
    ],
    "----",
    [
      "permissions - i.e.: ['availability']",
      "subs - i.e.: ['acc_61658f0378fae700a2b31f42']"
    ],
    {
      html: "GET ELEMENT TOKEN",
      component: 'button',
      props: {}
    }
  ]
]

const dateTimePickerPageCronofyTableConfig = { headers: dateTimePickerPageTableHeaders, rows: dateTimePickerPageTableRows }

export const dateTimePickerPageTablesConfig = {
  app: null,
  cronofy: dateTimePickerPageCronofyTableConfig
}
