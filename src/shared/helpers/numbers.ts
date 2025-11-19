export const formatFloat = (num: number, {
  minDecimals = 0,
  maxDecimals = 12,
  trimTrailingZeros = true
} = {}): string => {
  if (num === null || num === undefined || isNaN(num)) return "0";

  // Avoid scientific notation (e.g., 1e-7 → 0.0000001)
  let fixed = Number(num).toFixed(maxDecimals);

  // Trim trailing zeros
  if (trimTrailingZeros) {
    fixed = fixed.replace(/\.?0+$/, "");
  }

  // Ensure minimum decimals
  if (minDecimals > 0) {
    const [i, d = ""] = fixed.split(".");
    const padded = d.padEnd(minDecimals, "0");
    return padded.length ? `${i}.${padded}` : `${i}.${"0".repeat(minDecimals)}`;
  }

  return fixed;
}
export const formatPrice = (num: number): string => {
  if (num >= 1) return formatFloat(num, { maxDecimals: 2 });
  if (num >= 0.001) return formatFloat(num, { maxDecimals: 6 });
  return formatFloat(num, { maxDecimals: 12 });
}
