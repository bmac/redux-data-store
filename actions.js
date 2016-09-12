
export const push = function(jsonDocument) {
  return {
    type: 'PUSH',
    jsonDocument: jsonDocument
  }
}

export const updateRecord = function(record, update) {
  return {
    type: 'UPDATE',
    record: record,
    update: update,
  }
}
