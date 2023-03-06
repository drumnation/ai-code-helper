import { setStore, createStore } from 'hooks-for-redux';
import { applyMiddleware } from 'redux';

// example middle-ware
const logDispatch = (store) => (next) => (action) => {
  console.log('dispatching', action);
  return next(action);
};

export default setStore(createStore({}, applyMiddleware(logDispatch)));
