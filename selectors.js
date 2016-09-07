import makeArray from './make-array'

function coerceId(id) {
  return `${id}`
}

export const getAttributes = function(state, type, id) {
  id = coerceId(id)
  return Object.assign({
    id: id,
    type: type,
  }, state[type][id].attributes)
}

export const getRelationship = function(state, type, id, relationshipName) {
  var relData = state[type][id].relationships[relationshipName].data
  return getAttributes(state, relData.type, relData.id)
}

export const getRecord = function(state, type, id, include) {
  return Object.assign(
    getAttributes(state, type, id),
    makeArray(include).reduce(function(relationships, name) {
      relationships[name] = getRelationship(state, type, id, name)
      return relationships
    }, {})
  );
}

export const getRecordInfo = function(state, type, id) {
  
}


export const hasRecordForId = function(state, type, id) {

}

export const getQuery = function(state, label) {

}

// peekAll
export const getAll = function(state, type) {

}

