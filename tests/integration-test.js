import { createStore } from 'redux';
import { assert } from 'chai';
import reducer from '../reducer';
import { getRecord, getAll, getQuery } from '../selectors';
import { push, pushQuery, updateRecord } from '../actions';


describe('Integration tests', function() {
  it('should create a store', function() {
    var store = createStore(reducer)
  });
});
