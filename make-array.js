export default function makeArray(maybeArray) {
  if (!maybeArray) {
    return []
  }
  if (Array.isArray(maybeArray)) {
    return maybeArray;
  }
  return [maybeArray];
}
