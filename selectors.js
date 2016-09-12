import makeArray from './make-array'

function coerceId(id) {
  return `${id}`
}

const getAttributes = function(state, type, id) {
  id = coerceId(id)
  return Object.assign(
    {
      id: id,
      type: type,
    },
    state.records[type][id].attributes,
    state.records[type][id].changedAttributes
  )
}

const getRelationship = function(state, type, id, relationshipName) {
  var relationship = state.records[type][id].relationships[relationshipName]
  if (!relationship) {
    return undefined;
  }
  var relData = relationship.data
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

export const getQuery = function(state, label, include) {
  return state.queries[label].map(function({type, id}) {
    return getRecord(state, type, id, include);
  });
}

// peekAll
export const getAll = function(state, type, include) {
  return Object.keys(state.records[type]).map(function(id) {
    return getRecord(state, type, id, include);
  });
};
