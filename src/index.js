import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App, { readyPromise } from './App';
// import registerServiceWorker from './registerServiceWorker';

readyPromise.then(() => {
	ReactDOM.render(<App />, document.getElementById('root'));
})
// registerServiceWorker();
