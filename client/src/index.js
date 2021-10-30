import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";

window.createTable = (config) => {
  const headers = config.headers;
  const rows = config.rows;
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, index)=> {
            return (
              <td key={`header--${index}`} data-tablecolumn={header}>{header.toUpperCase()}</td>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {
          rows.map((row, index) => {
            return (
              <tr key={`row--${index}`}>
                {
                  row.map((cellValue, index) => {
                    return (
                      <td key={`cellValue--${index}`} data-tablecolumn={headers[index]}>
                        {cellValue instanceof Array
                          ? cellValue.map((p, index) => {
                            return <p key={`p--${index}`}>{p}</p>
                          })
                          : cellValue instanceof Object
                            ? React.createElement(cellValue.component, { ...cellValue.props }, cellValue.html)
                            : cellValue
                        }
                      </td>
                    )
                  })
                }
              </tr>
            ) 
          })
        }
        <tr>
        </tr>
      </tbody>
    </table>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals