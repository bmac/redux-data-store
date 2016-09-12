import merge from 'lodash.merge';


function makeArray(maybeArray) {
  if (!maybeArray) {
    return []
  }
  if (Array.isArray(maybeArray)) {
    return maybeArray;
  }
  return [maybeArray];
}

function addRecordToState(state, record) {
  state[record.type] = state[record.type] || {}
  state[record.type][record.id] = Object.assign({attributes: {}, relationships: {}, changedAttributes: {}}, record)
  // todo add state to the record
  return state
}

function normalizeDocument(jsonDocument) {
  var state = makeArray(jsonDocument.data).reduce(addRecordToState, {})

  return makeArray(jsonDocument.included).reduce(addRecordToState, state)
}

function attributeKeys(record) {
  return Object.keys(record).filter(function(key) {
    return key !== 'id' || key !== 'type';
  })
}

function updateRecord(state, record, update) {
  var originalRecord = getPrivateRecordState(state, record.type, record.id)
  return attributeKeys(update).reduce(function(recordState, key) {
    // No change for this attribute do nothing
    if (recordState.changedAttributes[key] === update[key]) {
      return recordState;
    }
    // The attributes has changed back to its original value, remove
    // the changed attribute entry
    if (recordState.attributes[key] === update[key] && key in recordState.changedAttributes) {
      // TODO do not make this a mutation
      delete recordState.changedAttributes[key];
      return recordState;
    }
    // this is a changed attribute
    var changedAttributes = Object.assign(
      {}, recordState.changedAttributes,
      {
        [key]: update[key],
      })
        
    return Object.assign({}, recordState, {
      changedAttributes: changedAttributes
    });
  }, originalRecord)
}

export default (state = {}, action) => {
  switch (action.type) {
    case 'PUSH':
      return Object.assign(
        {}, state, normalizeDocument(action.jsonDocument)
      );
    case 'UPDATE':
      return merge({}, state, {
        [action.record.type]: {
          [action.record.id]: updateRecord(state, action.record, action.update)
        }
      });
    default: 
      return state
  }
}


const getPrivateRecordState = function(state, type, id) {
  return state[type][id]
}
