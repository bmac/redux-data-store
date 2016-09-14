import { createStore } from 'redux';
import { assert } from 'chai';
import createReducer from '../reducer';
import { getAll } from '../selectors';
import { push, pushQuery, updateRecord } from '../actions';


describe('Selector: getAll', function() {
  it('should get all the records for a type', function() {
    var store = createStore(createReducer({}))
    store.dispatch(push({
      data: [{
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
      }, {
        "type": "post",
        "id": "2",
        "attributes": {
          "title": "Rails is omakase"
        },
      }],
      "included": [{
        "type": "person",
        "id": "9",
        "attributes": {
          "firstName": "Dan",
          "lastName": "Gebhardt",
          "twitter": "dgeb"
        }
      }, {
        "type": "post",
        "id": "3",
        "attributes": {
          "title": "On Interface Complexity"
        }
      }]
    }))

    var allPostRecords = getAll(store.getState(), 'post', ['author']);
    assert.deepEqual(allPostRecords, [{
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
    }, {
      "type": "post",
      "id": "2",
      "title": "Rails is omakase",
      author: undefined
    }, {
      "type": "post",
      "id": "3",
      "title": "On Interface Complexity",
      author: undefined
    }]);
  });
});
