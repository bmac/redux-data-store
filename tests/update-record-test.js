import { createStore } from 'redux';
import { assert } from 'chai';
import createReducer from '../reducer';
import { getRecord, getAll, getQuery } from '../selectors';
import { push, pushQuery, updateRecord } from '../actions';

var models = {
  post: {
    author: {
      relationshipType: 'belongs-to',
      types: ['person'],
      inverse: 'posts'
    }
  },
  person: {
    posts: {
      relationshipType: 'has-many',
      types: ['post'],
      inverse: 'author',
    }
  }
}

describe('ActionCreators: updateRecord', function() {
  it('should update an attribute on a record', function() {
    var store = createStore(createReducer({}))
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

  it('should update a relationship on a record', function() {
    var store = createStore(createReducer(models))
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
      }, {
        "type": "person",
        "id": "10",
        "attributes": {
          "firstName": "Tyler",
          "lastName": "Kellen",
          "twitter": "tkellen"
        }
      }],
    }))

    var record = getRecord(store.getState(), 'post', 1);
    var tyler = getRecord(store.getState(), 'person', 10);

    store.dispatch(updateRecord(record, { author: tyler }));

    var updatedRecord = getRecord(store.getState(), 'post', 1, ['author']);

    assert.equal(updatedRecord.author.twitter, 'tkellen')
  });

  it('should update both sides of a relationship', function() {
    var models = {
      post: {
        author: {
          relationshipType: 'belongs-to',
          types: ['person'],
          inverse: 'posts'
        }
      },
      person: {
        posts: {
          relationshipType: 'has-many',
          types: ['post'],
          inverse: 'author',
        }
      }
    }

    var store = createStore(createReducer(models))
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
      }, {
        "type": "person",
        "id": "10",
        "attributes": {
          "firstName": "Tyler",
          "lastName": "Kellen",
          "twitter": "tkellen"
        }
      }],
    }))

    var record = getRecord(store.getState(), 'post', 1);
    var tyler = getRecord(store.getState(), 'person', 10);

    store.dispatch(updateRecord(record, { author: tyler }));

    var updatedRecord = getRecord(store.getState(), 'post', 1, ['author']);
    var updatedTyler = getRecord(store.getState(), 'person', 10, ['posts']);

    assert.equal(updatedRecord.author.twitter, 'tkellen');
    assert.equal(updatedTyler.posts[0].id, 1);
    assert.equal(updatedTyler.posts[0].type, 'post');
    assert.equal(updatedTyler.posts[0].title, 'JSON API paints my bikeshed!');
  });
});
