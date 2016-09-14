import { combineReducers } from 'redux'
import records from './reducers/records';
import queries from './reducers/queries';

export default function(schema) {

  return combineReducers({
    records: records(schema),
    queries: queries,
  })
}
