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

const removeHypenInString = (str: string) => {
  return str.replaceAll('-', ' ');
};

const returnImgURl = (url: string) => {
  return `${process.env.NEXT_PUBLIC_IMAGE_URL}/products/${url}`;
};
export {
  parseCurrency,
  parseDateTime,
  separateStringHyphen,
  removeHypenInString,
  returnImgURl,
};
