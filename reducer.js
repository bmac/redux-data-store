import { combineReducers } from 'redux'
import records from './reducers/records';
import queries from './reducers/queries';

export default combineReducers({
  records: records,
  queries: queries,
})
