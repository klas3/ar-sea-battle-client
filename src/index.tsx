import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import './styles/index.css';
import App from './App';
import store from './redux/store';

const app = (
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
);

ReactDOM.render(app, document.getElementById('root'));
