import {compose, createStore} from 'redux';
import allReducers from './reducers'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const composeEnhancers = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
export default createStore(allReducers, composeEnhancers())

