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

}

export const getRecord = function(state, type, id, include) {
  return Object.assign(getAttributes(state, type, id), {
    author: getAttributes(state, 'person', '9')
  })
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

