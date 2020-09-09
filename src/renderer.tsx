import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';

import {Provider} from 'react-redux';
import store from './app/store'
import {setupIPCListeners, getBlockUpdate} from "./app/helpers/ipcRenderFunctions";

setupIPCListeners();
getBlockUpdate();

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <React.Fragment>
                <App/>
            </React.Fragment>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'));
