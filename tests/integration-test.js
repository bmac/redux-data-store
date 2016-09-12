import { createStore } from 'redux';
import { assert } from 'chai';
import reducer from '../reducer';
import { getRecord, getAll, getQuery } from '../selectors';
import { push, updateRecord } from '../actions';




describe('Integration tests', function() {
  it('should create a store', function() {
    var store = createStore(reducer)
  });

  it('should push JSONAPI data into the store', function() {
    var store = createStore(reducer)
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

  it('should get all the records for a type', function() {
    var store = createStore(reducer)
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

  it('should get all the records in a query', function() {
    var store = createStore(reducer)
    store.dispatch(push({
      rdsMeta: {
        queryLabel: 'my-query'
      },
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
        },
      }]
    }))

    var allPostRecords = getQuery(store.getState(), 'my-query', ['author']);
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
    }]);
  });



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
