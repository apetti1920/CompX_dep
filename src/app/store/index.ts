import {compose, createStore} from 'redux';
import allReducers from './reducers'

const composeEnhancers =
    (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
export default createStore(allReducers, composeEnhancers())

