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
  state[record.type][record.id] = Object.assign({attributes: {}, relationships: {}, changedAttributes: {}, changedRelationships: {}}, record)
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

function relationshipKeys(model, update) {
  if (!model) {
    return []
  }
  return Object.keys(model).filter(function(key) {
    return model[key].relationshipType;
  }).filter(function(key) {
    return key in update
  });
}

function getId(relationship) {
  return relationship && relationship.data && relationship.data.id
}

function getType(relationship) {
  return relationship && relationship.data && relationship.data.type
}

function relationshipIsSame(original, update, key) {
  return getId(original[key]) === update[key].id &&
    getType(original[key]) === update[key].type;
}

function updateRelationships(update, model, originalRecord) {
  return relationshipKeys(model, update).reduce(function(recordState, key) {
    if (relationshipIsSame(recordState.changedRelationships, update, key)) {
      return recordState;
    }
    if (relationshipIsSame(recordState.relationships, update, key)) {
      if (key in recordState.changedRelationships) {
        delete recordState.changedRelationships[key]
      }
      return recordState;
    }
    var changedRelationships = Object.assign(
      {}, recordState.changedRelationships,
      {
        [key]: {
          data: {
            type: update[key].type,
            id: update[key].id,
          }
        }
      })
    return Object.assign({}, recordState, {
      changedRelationships: changedRelationships
    });
  }, originalRecord)
}

function updateRecord(state, record, update, getModel) {
  var originalRecord = getPrivateRecordState(state, record.type, record.id)
  const updatedAttributes = attributeKeys(update).reduce(function(recordState, key) {
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

  return updateRelationships(update, getModel(originalRecord.type), updatedAttributes);
}


export default (models) => {

  let getModel = function(type) {
    return models[type]
  }

  return (state = {}, action) => {
    switch (action.type) {
      case 'PUSH':
        return Object.assign(
          {}, state, normalizeDocument(action.jsonDocument)
        );
      case 'UPDATE':
        return merge({}, state, {
          [action.record.type]: {
            [action.record.id]: updateRecord(state, action.record, action.update, getModel)
          }
        });
      default:
        return state
    }
  }
}

const getPrivateRecordState = function(state, type, id) {
  return state[type][id]
}
