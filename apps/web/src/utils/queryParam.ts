export const setQueryUrl = (
  queryParams: URLSearchParams,
  path: string,
  replace: any,
  param: string,
  value: string,
) => {
  queryParams.set(param, value);
  replace(`${path}?${queryParams.toString()}`, {
    scroll: false,
  });
};
