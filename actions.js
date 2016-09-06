
export const push = function(jsonDocument) {
  return {
    type: 'PUSH',
    jsonDocument: jsonDocument
  }
}
