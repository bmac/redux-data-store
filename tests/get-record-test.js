import { createStore } from 'redux';
import { assert } from 'chai';
import createReducer from '../reducer';
import { getRecord, getAll, getQuery } from '../selectors';
import { push, pushQuery, updateRecord } from '../actions';


describe('Selector: getRecord', function() {
  it('should get a record with a relationship', function() {
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

    var record = getRecord(store.getState(), 'post', 1);
    assert.deepEqual(record, {
      id: "1",
      type: 'post',
      title: "JSON API paints my bikeshed!"
    });
  });
  
  it('should get a record with a relationship', function() {
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

  it('should select nested relationships with include', function() {
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
        },
        "relationships": {
          "posts": {
            "data": [{ "type": "post", "id": "1" }]
          }
        }
      }]
    }))

    var record = getRecord(store.getState(), 'post', 1, ['author.posts']);
    assert.deepEqual(record, {
      id: "1",
      type: 'post',
      title: "JSON API paints my bikeshed!",
      author: {
        "type": "person",
        "id": "9",
        "firstName": "Dan",
        "lastName": "Gebhardt",
        "twitter": "dgeb",
        posts: [{
          id: "1",
          type: 'post',
          title: "JSON API paints my bikeshed!",
        }]
      }
    });
  });

  it('should select nested relationships with include where the same relationships is included with 2 nested relationships', function() {
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
        },
        "relationships": {
          "posts": {
            "data": [{ "type": "post", "id": "1" }]
          },
          profile: {
            "data": { "type": "profile", "id": "1" }
          }
        }
      }, {
        type: 'profile',
        id: '1',
        attributes: {
          avatar: 'my-gravatar-url'
        }
      }]
    }))

    var record = getRecord(store.getState(), 'post', 1, ['author.posts', 'author.profile']);
    assert.deepEqual(record, {
      id: "1",
      type: 'post',
      title: "JSON API paints my bikeshed!",
      author: {
        "type": "person",
        "id": "9",
        "firstName": "Dan",
        "lastName": "Gebhardt",
        "twitter": "dgeb",
        posts: [{
          id: "1",
          type: 'post',
          title: "JSON API paints my bikeshed!",
        }],
        profile: {
          id: '1',
          type: 'profile',
          avatar: 'my-gravatar-url',
        }
      }
    });
  });

  it('should return the same object from getRecord if the state doesn\'t change', function() {
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
    assert.equal(
      getRecord(store.getState(), 'post', 1, ['author']),
      getRecord(store.getState(), 'post', 1, ['author'])
    );
  });

  it('should return different objects if the includes param changes', function() {
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
    assert.notEqual(
      getRecord(store.getState(), 'post', 1, ['author']),
      getRecord(store.getState(), 'post', 1, [])
    );
  });

  it('should return different objects if state change', function() {
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
    var firstRecord = getRecord(store.getState(), 'post', 1, ['author']);
    // Update the store state
    store.dispatch(push({
      data: []
    }))

    assert.notEqual(
      firstRecord,
      getRecord(store.getState(), 'post', 1, ['author'])
    );
  });

  it('should return a frozen object', function() {
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

    assert.equal(
      Object.isFrozen(record),
      true
    );
  });
});
