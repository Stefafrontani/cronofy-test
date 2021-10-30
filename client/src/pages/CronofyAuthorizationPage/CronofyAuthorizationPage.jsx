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
    fetch(`${process.env.REACT_APP_COLONY_API_URL}/cronofy/auth/token`, { body: JSON.stringify(body), headers, method: "POST" })
      .then((res) => {
        return res.json()
      })
      .then((authorizationInfo) => {
        const { user, profile } = authorizationInfo;
        localStorage.setItem('cronofyUser', JSON.stringify({ ...user, profiles: [profile] }))
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