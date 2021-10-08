import React from 'react';

const SignInPage = () => {
  const REACT_APP_CRONOFY_SECRET = process.env.REACT_APP_CRONOFY_SECRET
  const REACT_APP_CRONOFY_CLIENT_ID = process.env.REACT_APP_CRONOFY_CLIENT_ID
  const REACT_APP_CRONOFY_AUTH_BASE_URL = process.env.REACT_APP_CRONOFY_AUTH_BASE_URL  
  const REACT_APP_CRONOFY_REDIRECT_URI = process.env.REACT_APP_CRONOFY_REDIRECT_URI
  return (
    <a
      className="App-link"
      href={`${REACT_APP_CRONOFY_AUTH_BASE_URL}?response_type=code&client_id=${REACT_APP_CRONOFY_CLIENT_ID}&redirect_uri=${REACT_APP_CRONOFY_REDIRECT_URI}&scope=${'create_calendar read_events create_event  delete_event  read_free_busy change_participation_status'}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      SYNC CRONOFY
    </a>
  )
}

export default SignInPage;