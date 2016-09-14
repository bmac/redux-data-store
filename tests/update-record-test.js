import { createStore } from 'redux';
import { assert } from 'chai';
import reducer from '../reducer';
import { getRecord, getAll, getQuery } from '../selectors';
import { push, pushQuery, updateRecord } from '../actions';

describe('ActionCreators: updateRecord', function() {
  it('should update a record', function() {
    var store = createStore(reducer)
    store.dispatch(push({
      data: [{
        "type": "post",
        "id": "1",
        "attributes": {
          "title": "JSON API paints my bikeshed!"
        }
      }],
    }))

    var record = getRecord(store.getState(), 'post', 1);

    store.dispatch(updateRecord(record, { title: 'New Title'}))

    var updatedRecord = getRecord(store.getState(), 'post', 1);
    assert.equal(updatedRecord.title, 'New Title')
  });
});
