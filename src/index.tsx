import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import App from './App';
import store from './redux/store';

const app = (
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
);

ReactDOM.render(app, document.body);
