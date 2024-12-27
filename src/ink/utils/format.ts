export function numberToLongString(x: number) {
  return x.toFixed(6).replace(".000000", "");
}
