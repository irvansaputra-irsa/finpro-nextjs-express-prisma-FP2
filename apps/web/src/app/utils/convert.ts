export const separateStringHyphen = (str: string) => {
  const split = str.split(' ');
  return split.join('-').toLowerCase();
};
