const displayStatusIndicator = (
  type: 'PROCESSED' | 'COMPLETED' | 'REJECTED' | 'CANCELED',
) => {
  if (type === 'PROCESSED') {
    return 'gray.600';
  }
  if (type === 'COMPLETED') {
    return 'green';
  }
  if (type === 'REJECTED') {
    return 'red';
  }
  return '#FFC94A';
};

export { displayStatusIndicator };
