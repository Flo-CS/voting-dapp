export function middleTruncate(text: string, max: number) {
  if (text.length <= max) return text;
  const mid = Math.floor(max / 2);
  return text.slice(0, mid) + "..." + text.slice(-mid);
}

export function rightTruncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}
