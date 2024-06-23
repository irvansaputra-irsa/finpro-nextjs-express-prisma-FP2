export function convertToISOFormat(datetime: Date) {
  const event = new Date(datetime);
  return event.toISOString();
}

export function deleteHypeninString(str: string) {
  const strings = str.toLowerCase().split('-');
  return strings.join(' ');
}
