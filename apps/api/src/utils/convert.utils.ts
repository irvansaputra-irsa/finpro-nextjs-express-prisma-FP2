export function convertToISOFormat(datetime: Date) {
  const event = new Date(datetime);
  return event.toISOString();
}
