export const parseNumber = (
  val: any,
  defaultVal: number,
  min?: number,
  max?: number
) => {
  let n = Number(val);
  if (isNaN(n)) n = defaultVal;
  if (min !== undefined) n = Math.max(n, min);
  if (max !== undefined) n = Math.min(n, max);
  return n;
};
