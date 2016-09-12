
export const push = function(jsonDocument) {
  return {
    type: 'PUSH',
    jsonDocument: jsonDocument
  }
}

export const pushQuery = function(label, jsonDocument) {
  return push(Object.assign({
    rdsMeta: {
      queryLabel: label
    },
  }, jsonDocument))
}

export const updateRecord = function(record, update) {
  return {
    type: 'UPDATE',
    record: record,
    update: update,
  }
}


// export const findRecord = function(query, adapter) {3
//   return function(dispatch) {
//     return adapter.findRecord(query).then(function(jsonDocument) {
//       return dispatch(push(jsonDocument))
//     });
//   }
// }
