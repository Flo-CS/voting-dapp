export function middleTruncate(text: string, max: number) {
  if (text.length <= max) return text;
  const mid = Math.floor(max / 2);
  return text.slice(0, mid) + "..." + text.slice(-mid);
}

export function rightTruncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

export function separateMultiline(text: string, separator = "\n") {
  return text
    .trim()
    .split(separator)
    .map((text) => text.trim())
    .filter((text) => text !== "");
}
