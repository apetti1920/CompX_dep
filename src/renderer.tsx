import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

import store from './app/store'
import App from './app/App';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <React.Fragment>
                <DndProvider backend={HTML5Backend}>
                    <App/>
                </DndProvider>
            </React.Fragment>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'));
