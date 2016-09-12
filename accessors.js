
var isDirtySymbol = new Symbol()

export const isDirty = function(record) {
  return record[isDirtySymbol];
}

var record = getRecord(state, 'coursepack', 1)


if (isDirty(record)) {
  dispatch(rollback(record))
}

isFetching(record)

isReloading(record)

changedAttributes(record)

errors(record).property
