import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import store from './app/store'
import App from './app/App';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <React.Fragment>
                <App/>
            </React.Fragment>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'));
