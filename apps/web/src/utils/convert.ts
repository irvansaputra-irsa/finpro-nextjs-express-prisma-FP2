const parseCurrency = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(num);
};

const parseDateTime = (date: Date) => {
  const format = new Date();
  return format.toLocaleString('id-ID', { timeZoneName: 'short' });
};

const separateStringHyphen = (str: string) => {
  const split = str.split(' ');
  return split.join('-').toLowerCase();
};
export { parseCurrency, parseDateTime, separateStringHyphen };
