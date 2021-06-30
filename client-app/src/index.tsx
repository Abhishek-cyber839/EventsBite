import React from 'react';
import ReactDOM from 'react-dom';
import './app/layouts/styles.css';
import App from './app/layouts/App';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css'
import { store,StoreContext } from './app/api/Stores/store';
import {Router} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ScrollToTop from './app/layouts/ScrollToTop';

export const history = createBrowserHistory();
/** 
 * with BrowserRouter we can pass history object only to components that are wrapped inside <App/> for redirection
 * whereas with Router we can pass history object to modules or folders that are externally used by those components for example 
 * agents.ts which is not a component but we are history.push(url) inside it for redirection but firstly we need to import 
 * createBrowserHistory from history and then pass it as a prop to <Router />,later we can import in files we ant to use.
 * 
 * 
 */

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <Router history={history}>
      <ScrollToTop/>
      <App />
    </Router>
  </StoreContext.Provider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
