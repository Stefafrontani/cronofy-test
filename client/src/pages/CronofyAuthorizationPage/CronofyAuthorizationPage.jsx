import React, { useEffect } from 'react';

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
    fetch(`${process.env.REACT_APP_COLONY_API_URL}/oauth/token`, { body: JSON.stringify(body), headers, method: "POST" })
      .then((res) => {
        console.log(res)
        return res.json()
      })
      .then((cronofyUser) => {
        console.log(cronofyUser)
        localStorage.setItem('cronofyUser', JSON.stringify(cronofyUser))
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