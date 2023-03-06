import React, { FC } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './redux/store'; // <<< import before calling createReduxModule or Provider
import { Provider } from 'hooks-for-redux';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const Root: FC = () => {
  return (
    <>
      {/* @ts-ignore */}
      <Provider>
        <App />
      </Provider>
    </>
  );
};

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
