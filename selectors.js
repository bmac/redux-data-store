import makeArray from './make-array';
import merge from 'lodash.merge';

var selectorMap = new WeakMap();

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

const getRelationship = function(state, type, id, relationshipName, includes) {
  const relationship = state.records[type][id].relationships[relationshipName]
  if (!relationship) {
    return undefined;
  }
  const relData = relationship.data
  if (Array.isArray(relData)) {
    return relData.map(function({ type, id }) {
      return getRecord(state, type, id, includes)
    })
  }
  return getRecord(state, relData.type, relData.id, includes)
}

const getRecordFromCache = function(state, type, id, include) {
  var cache = selectorMap.get(state.records) || {}
  var cacheKey = [type, id].concat(include).join('-')
  var record = cache[cacheKey] = cache[cacheKey] || computeRecord(state, type, id, include)
  selectorMap.set(state.records, cache)
  return record
}

//
export const getRecord = function(state, type, id, include) {
  include = makeArray(include).sort()
  return getRecordFromCache(state, type, id, include)
}

const computeRecord = function(state, type, id, include) {
  return Object.freeze(Object.assign(
    getAttributes(state, type, id),
    makeArray(include)
      .filter(name => name !== '')
      .reduce(function(relationships, name) {
        const includesParts = name.split('.');
        const relationshipName = includesParts[0];
        const includes = includesParts.slice(1).join('.');
        relationships[relationshipName] = getRelationship(state, type, id, relationshipName, includes);
        return relationships
      }, {})));
}

export const getQuery = function(state, label, include) {
  return state.queries[label].map(function({type, id}) {
    return getRecord(state, type, id, include);
  });
}

export const getAll = function(state, type, include) {
  return Object.keys(state.records[type]).map(function(id) {
    return getRecord(state, type, id, include);
  });
};
