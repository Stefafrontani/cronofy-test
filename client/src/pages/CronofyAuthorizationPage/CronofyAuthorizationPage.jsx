import React, { useEffect } from 'react';

const REACT_APP_CRONOFY_CLIENT_ID = process.env.REACT_APP_CRONOFY_CLIENT_ID
const REACT_APP_CRONOFY_AUTH_BASE_URL = process.env.REACT_APP_CRONOFY_AUTH_BASE_URL  
const REACT_APP_CRONOFY_REDIRECT_URI = process.env.REACT_APP_CRONOFY_REDIRECT_URI
const REACT_APP_CRONOFY_CLIENT_SECRET = process.env.REACT_APP_CRONOFY_CLIENT_SECRET

const CronofyAuthorizationPage = () => {
  const searchQuery = window.location.search
  const urlSearchParams = new URLSearchParams(searchQuery);
  const code = urlSearchParams.get("code");
  
  useEffect(() => {
    const body = {
      code: code
    }
    const headers = { "Content-Type": "application/json; charset=utf-8" }
    // const headers = { "Content-Type": "application/json" }
    fetch('http://localhost:4000/oauth/token', { body: JSON.stringify(body), headers, method: "POST" })
    .then((res) => {
      console.log(res)
    })
    .catch(err => console.log(err, 'asdasd'))
  }, [])

  return (
    <div>
      <p>CronofyAuthorizationPage</p>
      <p>redirect uri <strong>{process.env.REACT_APP_CRONOFY_REDIRECT_URI}</strong></p>
      <p>code <strong>{code}</strong></p>
    </div>
  )
}

export default CronofyAuthorizationPage;