
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
