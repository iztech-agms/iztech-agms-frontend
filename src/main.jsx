import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
