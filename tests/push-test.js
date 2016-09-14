import { createStore } from 'redux';
import { assert } from 'chai';
import createReducer from '../reducer';
import { getRecord } from '../selectors';
import { push } from '../actions';

describe('ActionCreators: push', function() {
  it('should push JSONAPI data into the store', function() {
    var store = createStore(createReducer({}))
    store.dispatch(push({
      data: {
        "type": "post",
        "id": "1",
        "attributes": {
          "title": "JSON API paints my bikeshed!"
        },
        "relationships": {
          "author": {
            "data": { "type": "person", "id": "9" }
          }
        }
      },
      "included": [{
        "type": "person",
        "id": "9",
        "attributes": {
          "firstName": "Dan",
          "lastName": "Gebhardt",
          "twitter": "dgeb"
        }
      }]
    }))

    var record = getRecord(store.getState(), 'post', 1, ['author']);
    assert.deepEqual(record, {
      id: "1",
      type: 'post',
      title: "JSON API paints my bikeshed!",
      author: {
        "type": "person",
        "id": "9",
        "firstName": "Dan",
        "lastName": "Gebhardt",
        "twitter": "dgeb"
      }
    });
  });
});
