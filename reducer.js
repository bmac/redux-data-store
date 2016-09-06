
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
  state[record.type][record.id] = record
  // todo add state to the record
  return state
}

function normalizeDocument(jsonDocument) {
  var state = makeArray(jsonDocument.data).reduce(addRecordToState, {})

  return makeArray(jsonDocument.included).reduce(addRecordToState, state)
}

export default (state, action) => {
  switch (action.type) {
    case 'PUSH':
      return Object.assign(
        {}, state, normalizeDocument(action.jsonDocument)
      );
    default: 
      return state
  }
}
