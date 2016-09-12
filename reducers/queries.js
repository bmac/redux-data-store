import makeArray from '../make-array'

function extractQueries(jsonDocument) {
  var label = jsonDocument.rdsMeta.queryLabel
  return {
    [label]: makeArray(jsonDocument.data).map(function(record) {
      return {
        type: record.type,
        id: record.id,
      };
    })
  };
}

function hasQueryLabel(jsonDocument) {
  return jsonDocument &&
    jsonDocument.rdsMeta &&
    jsonDocument.rdsMeta.queryLabel
}

function updateStateWithQueries(state, jsonDocument) {
  if (hasQueryLabel(jsonDocument)) {
    return Object.assign(
      {}, state, extractQueries(jsonDocument)
    );
  }
  return state
}

export default (state = {}, action) => {
  switch (action.type) {
    case 'PUSH':
      return updateStateWithQueries(state, action.jsonDocument)
    default: 
      return state
  }
}
