export function arrayMove<T>(arr: T[], indexFrom: number, indexTo: number) {
  indexTo = Math.min(indexTo, arr.length);

  const element = arr.splice(indexFrom, 1)[0];

  arr.splice(indexTo, 0, element);
}
